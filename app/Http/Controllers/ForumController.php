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
    const REG_USER = 'registered_user';

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $forums = Forum::all();
        return view('forum.index', compact('forums'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $possibleForms = $this->getFutureForms();
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

    public function hasForum($reservoir) {
        if (DB::table('forums')->where('reservoir_id', $reservoir->id)->count() > 0) {
           return true;
        }

        return false;
    }

    /**
     * @param $reservoirId
     * @return array
     */
    public function getComments($reservoirId) {
        $forumId = Forum::where('reservoir_id', $reservoirId)->get()->first()->id;

        try {
            $data = [
              'comments' => Comment::where('forum_id', $forumId)->get(),
              'user_data' => User::all('id', 'name'),
              'curr_user' => Auth::guest() ? null : Auth::id()
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

    public function validation($title, $desc, $reservoirId)
    {
        $message = [];

        if (strlen($title) < 8 || !preg_match('/^[a-žA-Ž\s]+$/', $title)) {
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
     * @param Forum $forum
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Forum $forum)
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $possibleForms = $this->getFutureForms();
                return view('forum.edit', compact('forum', 'possibleForms'));
            }
        }

        return redirect()->route('forum.index')->with('error', 'Forumu var rediģēt tikai administrators!');
    }


    /**
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
     * @param $forumId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($forumId)
    {
        if (empty(Forum::find($forumId))) {
            return redirect()->route('forum.index')->with('error', 'Diskusija ar doto ID neeksistē.');
        }

        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                DB::table('comments')->where('forum_id', $forumId)->delete();
                $forum = Forum::find($forumId);
                $forum->delete();
                return redirect()->route('forum.index')
                    ->with('success', 'Diskusija ir izdzēsta veiksmīgi');
            }
        }

        return redirect()->route('forum.index')->with('error', 'Forumu var izdzēst tikai administrators!');
    }
}
