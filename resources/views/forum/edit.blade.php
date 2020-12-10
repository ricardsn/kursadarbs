@extends('layout.mainlayout')
@section('content')
    <form class="form-container" method="post" action="{{  route('updateForum', $forum->id) }}">
        @csrf
        <h3>Foruma rediģēšana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="title" name="title" required minlength="4" value="{{ $forum->title  }}">
        </div>
        <div class="form-group">
            <label>Apraksts</label>
            <textarea class="form-control" type="text" id="desc" name="desc" required> {{ $forum->desc }} </textarea>
        </div>
        <div class="form-group">
            <label>Ūdenstilpne</label>
            <select class="type-select" name="reservoir_id" id="reservoir_id" required>
                <option value="{{ $forum->reservoir_id  }}">
                    {{ \Illuminate\Support\Facades\DB::table('reservoirs')->where('id',  $forum->reservoir_id)->first()->name  }}
                </option>
                @if($possibleForms != [])
                    @foreach($possibleForms as $reservoir)
                        <option value="{{ $reservoir->id }}">
                            {{ $reservoir->name  }}
                        </option>
                    @endforeach
                @endif
            </select>
        </div>
        <button class="btn btn-outline-primary my-2 my-sm-0" id="save-reservoir" type="submit">Atjaunot</button>
        @endsection
        <b></b>
