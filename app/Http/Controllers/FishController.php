<?php

namespace App\Http\Controllers;

use App\Models\Fish;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class FishController extends Controller
{
    const ADMIN = 'administrator';

    /**
     * Display a listing of fish resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fishes = Fish::all();
        return view('fish.index', compact('fishes'));
    }

    /**
     * Show the form for creating a new fish species.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) { //checking if user is admin
                return view('fish.create');
            }
        }

        return redirect()->route('fish.index')->with('error', 'Zivs sugu var pievienot tikai administrators!');
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
     * Store a newly created fish specie in database.
     *
     * @param Request $request
     */
    public function storeFish(Request $request) {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        $imageName = time().'.'.$request->image->extension(); //renaming to unique
        $request->image->move(public_path('images/fishes'), $imageName); //saving to pub folder

        $fish = array(
            'name' => $request->name,
            'link' => $request->link,
            'image' => $imageName
        );

        Fish::create($fish); //creating fish specie
    }

    /**
     * Display the specified fish specie.
     *
     * @param  \App\Models\Fish  $fish
     * @return \Illuminate\Http\Response
     */
    public function show(Fish $fish)
    {
        if (!Fish::find($fish->id)) {
            return redirect()->route('fish.index')->with('error', 'Zivs suga ar doto identifikatoru neeksistē datubāzē!');
        }

        return view('fish.show', compact('fish'));
    }

    /**
     * Show the form for editing the specified fish specie.
     *
     * @param  \App\Models\Fish  $fish
     * @return \Illuminate\Http\Response
     */
    public function edit(Fish $fish)
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) { //checking if admin
                return view('fish.edit', compact('fish'));
            }
        }

        return redirect()->route('fish.index')->with('error', 'Zivs sugu var rediģēt tikai administrators!');
    }

    /**
     * Update the specified fish specie in database.
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
            $imageName = time().'.'.$request->image->extension(); //renaming to unique
            $request->image->move(public_path('images/fishes'), $imageName); //moving to public forlder
            $image_path = sprintf('%s/images/fishes/%s', public_path(), $fish->image);
            if(File::exists($image_path)) { //deleting previously saved image
                File::delete($image_path);
            }
        }

        $fish_update = array(
            'name' => $request->name,
            'link' => $request->link,
            'image' => $imageName ? $imageName : $fish->image
        );

        $fish->update($fish_update); //updating specie
    }


    /**
     * Deleting the specified fish specie in database.
     *
     * @param Fish $fish
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function destroy(Fish $fish): \Illuminate\Http\RedirectResponse
    {
        if (!Fish::find($fish->id)) {
            return redirect()->route('fish.index')->with('error', 'Zivs suga ar doto identifikatoru neeksistē datubāzē!');
        }

        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                DB::table('fish_reservoir')->where('fish_id', $fish->id)->delete(); //removing fish from reservoir
                $image_path = sprintf('%s/images/fishes/%s', public_path(), $fish->image);
                if(File::exists($image_path)) { //deleting fish image
                    File::delete($image_path);
                }
                $fish->delete(); //deleting fish specie

                return redirect()->route('fish.index')
                    ->with('success','Zivs suga tika izdzēsta!');

            }
        }

        return redirect()->route('fish.index')->with('error', 'Zivs sugu var izdzēst tikai administrators!');
    }
}
