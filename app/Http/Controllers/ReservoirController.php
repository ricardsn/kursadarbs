<?php

namespace App\Http\Controllers;

use App\Models\Fish;
use App\Models\Reservoir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReservoirController extends Controller
{
    const ADMIN = 'administrator';
    const REG_USER = 'registered_user';

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        return view('reservoir.index');
    }


    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function create()
    {
        $fishes = Fish::all(['id', 'name']);
        if (!Auth::guest()) {
            return view('reservoir.create', compact('fishes'));
        }

        return redirect()->route('home')->with('error', 'Tikai administrators var pievienot ūdenstilpni!');
    }


    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function showCoordinates()
    {
        $reservoirs = Reservoir::all()->where('status', true);
        return view('reservoir.show', compact('reservoirs'));
    }

    public function showUnacceptedCoordinates()
    {
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $reservoirs = Reservoir::all()->where('status', false);
                return view('reservoir.unacceptedShow', compact('reservoirs'));
            }
        }

        return redirect()->route('home')->with('error', 'Tikai administrators var apskatīt neakceptētās ūdenstilpnes');
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

    /**
     * @param Request $request
     */
    public function saveCoordinates(Request $request)
    {
        $reservoir = array(
            'name' => $request->name,
            'lat' => $request->lat,
            'long' => $request->long,
            'type' => $request->type,
            'status' => Auth::user()->role == self::ADMIN ? true : false
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
    public function getCoordinateEdit($reservoir)
    {
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

    public function getCoordinates()
    {
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
            $data = Reservoir::all()->where('status', true);
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
        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $fishes = Fish::all(['id', 'name']);
                $coordinate = DB::table('coordinates')->where('reservoir_id', $reservoir->id)->first();
                $addedFishes = DB::table('fish_reservoir')->where('reservoir_id', $reservoir->id)->get();
                return view('reservoir.edit', compact('fishes', 'reservoir', 'coordinate', 'addedFishes'));
            }
        }

        return redirect()->route('home')->with('error', 'Tikai administrators var rediģēt ūdenstilpni!');
    }

    public function showSingleReservoir($id)
    {
        if (!Reservoir::find($id)) {
            return redirect()->route('home')->with('error', 'Ūdenstilpne neeksistē datubāzē.');
        }

        $fishes = Fish::all(['id', 'name']);
        $reservoir = Reservoir::find($id);
        $coordinate = DB::table('coordinates')->where('reservoir_id', $reservoir->id)->first();
        $addedFishes = DB::table('fish_reservoir')->where('reservoir_id', $reservoir->id)->get();

        return view('reservoir.single', compact('fishes', 'reservoir', 'coordinate', 'addedFishes'));
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

    public function acceptCoordinates($id)
    {
        if (Reservoir::find($id)) {
            return redirect()->route('home')->with('error', 'Datubāzē nav neakceptētās ūdenstilpnes dati.');
        }

        if (!Auth::guest()) {
            if (Auth::user()->role == self::ADMIN) {
                $reservoir = Reservoir::find($id);
                $reservoir->status = true;
                $reservoir->save();

                return redirect()->route('show')->with('success', 'Ūdenstilpne tika akceptēta!');
            }
        }

        return redirect()->route('home')->with('error', 'Ūdenstilpne var akceptēt tikai administrators!');
    }

    public function removeDataBeforeUpdate($id) {
        DB::table('fish_reservoir')->where('reservoir_id', $id)->delete();
        DB::table('coordinates')->where('reservoir_id', $id)->delete();
    }

    public function removeDataBeforeDelete($id)
    {
        DB::table('fish_reservoir')->where('reservoir_id', $id)->delete();
        DB::table('coordinates')->where('reservoir_id', $id)->delete();
        $forum =  DB::table('forums')->where('reservoir_id', $id);
        if(isset($forum)) {
            DB::table('comments')->where('forum_id', $forum->get()->first()->id)->delete();
            $forum->delete();
        }
    }


    /**
     * @param $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        if (!Reservoir::find($id)) {
            return redirect()->route('show')
                ->with('error','Ūdenstilpne neeksistē datubāzē.');
        }

        if (!Auth::guest()) {
          if(Auth::user()->role == self::ADMIN) {
              $reservoir = Reservoir::find($id);
              $reservoir->delete();
              $this->removeDataBeforeDelete($id);

              return redirect()->route('show')
                  ->with('success','Ūdenstilpne tika izdzēsta');
          }
        }

        return redirect()->route('show')
            ->with('error','Tikai administrators var izdzēst ūdenstilpni!');
    }
}
