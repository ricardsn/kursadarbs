<?php

namespace App\Http\Controllers;

use App\Models\Fish;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class FishController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fishes = Fish::all();
        return view('fish.index', compact('fishes'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('fish.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
//
    }

    /**
     * @param Request $request
     */
    public function storeFish(Request $request) {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('images/fishes'), $imageName);

        $fish = array(
            'name' => $request->name,
            'link' => $request->link,
            'image' => $imageName
        );

        Fish::create($fish);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Fish  $fish
     * @return \Illuminate\Http\Response
     */
    public function show(Fish $fish)
    {
        return view('fish.show', compact('fish'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Fish  $fish
     * @return \Illuminate\Http\Response
     */
    public function edit(Fish $fish)
    {
        return view('fish.edit', compact('fish'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Fish  $fish
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Fish $fish)
    {
        $imageName = null;
        if($request->isImageChanged == 'true') {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images/fishes'), $imageName);
            $image_path = sprintf('%s/images/fishes/%s', public_path(), $fish->image);
            if(File::exists($image_path)) {
                File::delete($image_path);
            }
        }

        $fish_update = array(
            'name' => $request->name,
            'link' => $request->link,
            'image' => $imageName ? $imageName : $fish->image
        );

        $fish->update($fish_update);
    }


    /**
     * @param Fish $fish
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function destroy(Fish $fish): \Illuminate\Http\RedirectResponse
    {
        DB::table('fish_reservoir')->where('fish_id', $fish->id)->delete();
        $image_path = sprintf('%s/images/fishes/%s', public_path(), $fish->image);
        if(File::exists($image_path)) {
            File::delete($image_path);
        }
        $fish->delete();

        return redirect()->route('fish.index')
            ->with('success','Challenge updated successfully');
    }
}
