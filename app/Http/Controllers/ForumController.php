<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Forum;
use App\Models\Reservoir;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ForumController extends Controller
{
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
        $possibleForms = $this->getFutureForms();
        return view('forum.create', compact('possibleForms'));
    }

    /**
     * Returning all reservoirs, that haven't had any forum attached
     *
     * @return array
     */
    public function getFutureForms() {
        $reservoirs = Reservoir::all();
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
              'user_data' => User::all('id', 'name')
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
    public function store(Request $request)
    {
        $forum = [
           'title' => $request->title,
           'desc' => $request->desc,
           'reservoir_id' => $request->reservoir
        ];

        Forum::create($forum);
        return redirect()->route('forum.index')
            ->with('success', 'Forum updated successfully');
    }


    /**
     * @param $forum
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function show($forum)
    {
        $reservoirForum = Forum::where('reservoir_id', $forum)->get()->first();
        return view('forum.show', compact('reservoirForum'));
    }


    /**
     * @param Forum $forum
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Forum $forum)
    {
        $possibleForms = $this->getFutureForms();
        return view('forum.edit', compact('forum', 'possibleForms'));
    }


    /**
     * @param Request $request
     * @param $forumId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $forumId)
    {
        $forum = Forum::find($forumId);
        $forum->update($request->all());
        return redirect()->route('forum.edit', $forum->id)
            ->with('success', 'Forum updated successfully');
    }


    /**
     * @param $forumId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($forumId)
    {
        DB::table('comments')->where('forum_id', $forumId)->delete();
        $forum = Forum::find($forumId);
        $forum->delete();
        return redirect()->route('forum.index')
            ->with('success', 'Forum updated successfully');
    }
}
