@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
            @csrf
            <h3>Ūdenstilpnes pievienošana</h3>
            <div class="form-group">
                <label>Nosaukums</label>
                <input class="form-control" type="text" id="name" name="name" required minlength="4">
            </div>
            <div class="form-group">
                <label>Platums</label>
                <input class="form-control" type="number" id="lat" step="any" name="lat" required>
            </div>
            <div class="form-group">
                <label>Garums</label>
                <input class="form-control"  type="number" id="long" step="any" name="long" required>
            </div>
            <div class="form-group">
                <label>Rādiuss (metros)</label>
                <input class="form-control" id="radius-select" type="number" name="radius" min="1" required>
            </div>
            <div id="createmap"></div>
            <div class="form-group">
                <label>Tips</label>
                <select class="type-select" name="type" id="type" required>
                    <option value="Ezers">Ezers</option>
                    <option value="Upe">Upe</option>
                </select>
            </div>
            <div class="form-group">
                <label>Zivis</label>
                <select id="fish-dropdown" name="fishes[]" multiple="multiple" class="form-control" >
                    @foreach($fishes as $fish)
                        <option value="{{ $fish->id }}">
                            {{ $fish->name }}
                        </option>
                    @endforeach
                </select>

            </div>
            <button class="btn btn-outline-primary my-2 my-sm-0" id="save-reservoir">Pievienot</button>
    </div>
    <script src="{{ asset('js/map/create-map.js')  }}"></script>
@endsection
<b></b>
