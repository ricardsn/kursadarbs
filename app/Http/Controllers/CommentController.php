<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Forum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created comment in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $forumId = Forum::where('reservoir_id', $request->reservoirId)->get()->first()->id;

        if (empty($forumId)) {
            return redirect()->route('home')->with('error', 'Nevar pievienot komentāru neeksistējošai diskusijai. ');
        }

        $userId = Auth::user()->getAuthIdentifier(); //getting auth id
        $commentData = $request->commentData; //getting comment data

        $comment = [
            'content' => $commentData,
            'forum_id' => $forumId,
            'user_id' => $userId
        ];

        Comment::create($comment)->save(); //saving to database
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified comment in database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id != Auth::id()) {
            return redirect()->route('forum.show', $comment->forum_id)->with('error', 'Šis komentārs nav pievienots ar Jūsu lietotāju.');
        }

        if (!Comment::find($comment->id)) {
            return redirect()->route('forum.show', $comment->forum_id)->with('error', 'Komentārs ar doto identifikatoru neeksistē.');
        }

        $comment->content = $request->commentData;
        $comment->update();
    }

    /**
     * Remove the comment resource from database.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        if(Auth::guest() || Auth::id() != $comment->user_id) {
            return redirect()->route('forum.show', $comment->forum_id)->with('error', 'Neautorizēts vai nepareizs lietotājs centās izdzēst komentāru.');
        }

        $comment->delete();
    }
}
