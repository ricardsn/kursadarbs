<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Fish;
use App\Models\Forum;
use App\Models\Reservoir;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ForumController extends Controller
{
    const ADMIN = 'administrator';

    /**
     * Display a listing of the forums.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $forums = Forum::all();
        return view('forum.index', compact('forums'));
    }

    /**
     * Show the form for creating a new forum.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $possibleForms = $this->getFutureForms(); //getting list of reservoirs, that don't have forums yet
                return view('forum.create', compact('possibleForms'));
            }
        }

        return redirect()->route('forum.index')->with('error', 'Forumu var pievienot tikai administrators!');
    }

    /**
     * Returning all reservoirs, that haven't had any forum attached
     *
     * @return array
     */
    public function getFutureForms() {
        $reservoirs = Reservoir::all()->where('status', true);
        $futureForms = [];

        foreach ($reservoirs as $reservoir) {
            if(!$this->hasForum($reservoir)) {
                array_push($futureForms, $reservoir);
            }
        }

        return $futureForms;
    }

    /**
     * Checks if reservoir has forum or not
     *
     * @param $reservoir
     * @return bool
     */
    public function hasForum($reservoir): bool
    {
        if (DB::table('forums')->where('reservoir_id', $reservoir->id)->count() > 0) {
           return true;
        }

        return false;
    }

    /**
     * Sends to frontend all comment and user data via Ajax call
     *
     * @param $reservoirId
     * @return array
     */
    public function getComments($reservoirId) {
        $forumId = Forum::where('reservoir_id', $reservoirId)->get()->first()->id;

        try {
            $data = [
              'comments' => Comment::where('forum_id', $forumId)->get(),
              'user_data' => User::all('id', 'name'),
              'curr_user' => Auth::guest() ? null : Auth::id() //checks if user is signed
            ];
            json_encode($data);
        }
        catch (\mysql_xdevapi\Exception $exception) {
            $data = [
                'status' => 'error',
                'message' => $exception
            ];
            $data->toJson();
        }
        return $data;
    }


    /**
     * Storing form data
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $message = $this->validation($request->title, $request->desc, $request->reservoir);
       if (empty($message)) {
           $forum = [
               'title' => $request->title,
               'desc' => $request->desc,
               'reservoir_id' => $request->reservoir
           ];

           Forum::create($forum);
           return redirect()->route('forum.index')
               ->with('success', 'Diskusija tika pievienota veiksmīgi!');
       }

        return redirect()->route('forum.create')->with('error-array',$message)->withInput($request->all());
    }

    /**
     * Validating forum data
     *
     * @param $title
     * @param $desc
     * @param $reservoirId
     * @return array
     */
    public function validation($title, $desc, $reservoirId)
    {
        $message = [];

        if (strlen($title) < 8 || !preg_match('/^[a-žA-Ž\s]+$/', $title)) { //using regex to check if consists of only letters
            array_push($message, 'Diskusijas nosaukums ir mazāks par 8 burtiem vai satur simbolus, kas nav latīniski burti.');
        }

        if (strlen($desc) < 40) {
            array_push($message, 'Diskusijas apraksts satur mazāk par 40 simboliem.');
        }

        if(!Reservoir::find($reservoirId)) {
            array_push($message, 'Pievienotā ūdenstilpne neeksistē datubāzē.');
        }

        return $message;
    }


    /**
     * Returning specific forum view with fishes, comments are got by another function and displayed with JS
     *
     * @param $forum
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function show($forum)
    {
        $reservoirForum = Forum::where('reservoir_id', $forum)->get()->first();

        if (!empty($reservoirForum)) {
            $fishesIDs = DB::table('fish_reservoir')->where('reservoir_id', $forum)->get()->all();
            $fishes = [];
            foreach ($fishesIDs as $fish) {
                array_push($fishes, Fish::find($fish->fish_id));
            }
            return view('forum.show', compact('reservoirForum', 'fishes'));
        }

        return redirect()->route('forum.index')->with('error','Diskusija ar doto ID neeksistē datubāzē.');
    }


    /**
     * Returns forum edit view with reservoirs that doesn't have form yet
     *
     * @param Forum $forum
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Forum $forum)
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) { //checks if admin
                $possibleForms = $this->getFutureForms();
                return view('forum.edit', compact('forum', 'possibleForms'));
            }
        }

        return redirect()->route('forum.index')->with('error', 'Forumu var rediģēt tikai administrators!');
    }


    /**
     * Updating forum data
     *
     * @param Request $request
     * @param $forumId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $forumId)
    {
        $message = $this->validation($request->title, $request->desc, $request->reservoir_id);
        if (empty($message)) {
            $forum = Forum::find($forumId);
            $forum->update($request->all());

            return redirect()->route('forum.edit', $forum->id)
                ->with('success', 'Diskusija ir atjaunota veiksmīgi');
        }

        return redirect()->route('forum.edit', $forumId)->with('error-array',$message);

    }


    /**
     * Deleting forum data
     *
     * @param $forumId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($forumId)
    {
        if (empty(Forum::find($forumId))) {
            return redirect()->route('forum.index')->with('error', 'Diskusija ar doto ID neeksistē.');
        }

        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) { //checks if admin
                DB::table('comments')->where('forum_id', $forumId)->delete(); //deleting all comments that were attached to forum
                $forum = Forum::find($forumId);
                $forum->delete();
                return redirect()->route('forum.index')
                    ->with('success', 'Diskusija ir izdzēsta veiksmīgi');
            }
        }

        return redirect()->route('forum.index')->with('error', 'Forumu var izdzēst tikai administrators!');
    }
}
