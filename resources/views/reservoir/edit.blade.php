@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        @csrf
        <h3>Ūdenstilpnes rediģēšana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="name" name="name" required minlength="4" value="{{ $reservoir->name }}">
        </div>
        <div class="form-group">
            <label>Platums</label>
            <input class="form-control" type="number" id="lat" step="any" name="lat" required value="{{ $reservoir->lat }}">
        </div>
        <div class="form-group">
            <label>Garums</label>
            <input class="form-control"  type="number" id="long" step="any" name="long" required value="{{ $reservoir->long }}">
        </div>
        <div class="form-group">
            <label>Rādiuss (metros)</label>
            <input class="form-control" id="radius-select" type="number" name="radius" min="1" required value="{{ $coordinate->radius }}">
        </div>
        <div id="createmap"></div>
        <div class="form-group">
            <label>Tips</label>
            <select class="type-select" name="type" id="type" required value="{{ $reservoir->type }}">
                <option value="Ezers" {{ $reservoir->type == 'Ezers' ? 'selected' : '' }}>Ezers</option>
                <option value="Upe" {{ $reservoir->type == 'Upe' ? 'selected' : ''  }}>Upe</option>
            </select>
        </div>
        <div class="form-group">
            <label>Zivis</label>
            <select id="fish-dropdown" name="fishes[]" multiple="multiple" class="form-control" >
                @foreach($fishes as $fish)
                    <option value="{{ $fish->id }}" {{ isInList($addedFishes, $fish->id) ? 'selected' : '' }}>
                        {{ $fish->name }}
                    </option>
                @endforeach
            </select>

        </div>
        <button class="btn btn-outline-primary my-2 my-sm-0" id="save-reservoir">Saglabāt izmaiņas</button>
    </div>
    <script src="{{ asset('js/map/edit-map.js')  }}"></script>
@endsection
<b></b>
