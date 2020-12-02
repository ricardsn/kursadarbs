<?php

namespace App\Http\Controllers;

use App\Models\Fish;
use App\Models\Reservoir;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use mysql_xdevapi\Table;
use Symfony\Component\Console\Input\Input;

class ReservoirController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        return view('reservoir.index');
    }


    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function create()
    {
        $fishes = Fish::all(['id', 'name']);
        return view('reservoir.create', compact('fishes'));
    }


    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function showCoordinates() {
        $coordinates = Reservoir::all();
        return view('reservoir.show', compact('coordinates'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    public function saveCoordinates(Request $request) {
        $reservoir = array(
            'name' => $request->name,
            'lat' => $request->lat,
            'long' => $request->long,
            'type' => $request->type
        );

        $reservoir = Reservoir::create($reservoir);
        $fishes = $request->fishes;
        foreach ($fishes as $fish) {
            $reservoir->fishes()->attach($fish);
        }
        $coordinates = json_decode($request->coordinates);

        foreach ($coordinates as $coordinate) {
            DB::table('coordinates')->insert(
                [
                    'reservoir_id' => $reservoir->id,
                    'lat' => $coordinate->lat,
                    'long' => $coordinate->lng,
                    'radius' => $request->radius
                ]
            );
        }
    }

    /**
     * @param Reservoir $reservoir
     * @return Reservoir[]|array|\Illuminate\Database\Eloquent\Collection
     */
    public function getCoordinateEdit($reservoir) {
        try {
            $data = DB::table('coordinates')->where('reservoir_id', $reservoir)->get();
            $data->toJson();
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

    public function getCoordinates() {
        try {
            $data = DB::table('coordinates')->get()->all();
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
     * @param Reservoir $reservoir
     * @return Reservoir[]|array|\Illuminate\Database\Eloquent\Collection
     */
    public function show()
    {
        try {
            $data = Reservoir::all();
            $data->toJson();
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
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Reservoir  $reservoir
     * @return \Illuminate\Http\Response
     */
    public function edit(Reservoir $reservoir)
    {
        $fishes = Fish::all(['id', 'name']);
        $coordinate = DB::table('coordinates')->where('reservoir_id', $reservoir->id)->first();
        $addedFishes = DB::table('fish_reservoir')->where('reservoir_id', $reservoir->id)->get();
        return view('reservoir.edit', compact('fishes', 'reservoir', 'coordinate', 'addedFishes'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Reservoir  $reservoir
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $reservoir_update = array(
            'name' => $request->name,
            'lat' => $request->lat,
            'long' => $request->long,
            'type' => $request->type
        );
        $reservoir = Reservoir::find($id);
        $reservoir->update($reservoir_update);
        $fishes = $request->fishes;
        $this->removeDataBeforeUpdate($id);

        foreach ($fishes as $fish) {
            $reservoir->fishes()->attach($fish);
        }

        $coordinates = json_decode($request->coordinates, true);

        foreach ($coordinates as $coordinate) {
            DB::table('coordinates')->insert(
                [
                    'reservoir_id' => $reservoir->id,
                    'lat' => $coordinate['lat'],
                    'long' => isset($coordinate['long']) ? $coordinate['long'] : $coordinate['lng'] ,
                    'radius' => $request['radius']
                ]
            );
        }
    }

    public function removeDataBeforeUpdate($id) {
        DB::table('fish_reservoir')->where('reservoir_id', $id)->delete();
        DB::table('coordinates')->where('reservoir_id', $id)->delete();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Reservoir  $reservoir
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reservoir $reservoir)
    {
        //
    }
}
