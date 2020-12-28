@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        @csrf
        <h3>Zivs rediģēšana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="name" name="name" required minlength="4" value="{{ $fish->name }}">
        </div>
        <div class="form-group">
            <label>Links</label>
            <input class="form-control" type="text" id="link" name="link" required value="{{ $fish->link }}">
        </div>
        <div class="form-group" id="change">
            <img src="{{ asset(sprintf('/images/fishes/%s', $fish->image))  }}" style="width: 400px; height: 200px; margin: auto" alt="fish image">
            <button class="btn btn-info" id="change-image">Mainīt bildi</button>
        </div>
        <div class="ImageUploader" id="ImageUploader" style="display: none;">
            @csrf
            <div class="row">
                <div class="col-md-6">
                    <label>Bilde</label>
                    <input type="file" name="image" id="uploaded-image" class="form-control">
                </div>
            </div>
        </div>
        <button class="btn btn-outline-primary my-2 my-sm-0" id="save-fish" type="submit">Saglabāt</button>
    </div>
    <script src="{{ asset('js/fish/edit.js')  }}"></script>
@endsection
<b></b>
