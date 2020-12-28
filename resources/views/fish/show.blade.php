@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        @csrf
        <h3>{{ $fish->name }}</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="name" name="name" readonly minlength="4" value="{{ $fish->name }}">
        </div>
        <div class="form-group">
            <a href="{{ $fish->link  }}" target="_blank">Vairāk informācijas</a>
        </div>
        <div class="form-group" id="change">
            <img src="{{ asset(sprintf('/images/fishes/%s', $fish->image))  }}" style="width: 400px; height: 200px; margin: auto" alt="fish image">
        </div>
    </div>
@endsection
<b></b>
