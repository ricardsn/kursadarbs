@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        @csrf
        <h3>Ūdenstilpnes rediģēšana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="name" name="name" readonly minlength="4" value="{{ $reservoir->name }}">
        </div>
        <div class="form-group">
            <label>Platums</label>
            <input class="form-control" type="number" id="lat" step="any" name="lat" readonly value="{{ $reservoir->lat }}">
        </div>
        <div class="form-group">
            <label>Garums</label>
            <input class="form-control"  type="number" id="long" step="any" name="long" readonly value="{{ $reservoir->long }}">
        </div>
        <div class="form-group">
            <label>Rādiuss (metros)</label>
            <input class="form-control" id="radius-select" type="number" name="radius" min="1" readonly value="{{ $coordinate->radius }}">
        </div>
        <div id="createmap"></div>
        <div class="form-group">
            <label>Tips</label>
            <select class="type-select" name="type" id="type" disabled value="{{ $reservoir->type }}">
                <option value="Ezers" {{ $reservoir->type == 'Ezers' ? 'selected' : '' }}>Ezers</option>
                <option value="Upe" {{ $reservoir->type == 'Upe' ? 'selected' : ''  }}>Upe</option>
            </select>
        </div>
        <div class="form-group">
            <label>Zivis</label>
            <select id="fish-dropdown" name="fishes[]" multiple="multiple" class="form-control" disabled >
                @foreach($fishes as $fish)
                    <option value="{{ $fish->id }}" {{ isInList($addedFishes, $fish->id) ? 'selected' : '' }}>
                        {{ $fish->name }}
                    </option>
                @endforeach
            </select>

        </div>
        @auth
            @if(Auth::user()->role == 'administrator' && $reservoir->status == false)
                <form method="post" action="{{ route('acceptCoordinates', $reservoir->id)  }}">
                    @csrf
                    <button class="btn btn-success" type="submit">Akceptēt</button>
                </form>
            @endif
        @endauth
    </div>
    <script src="{{ asset('js/map/single-map.js')  }}"></script>
@endsection
<b></b>
