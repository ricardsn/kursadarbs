@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        @csrf
        <h3>Zivs pievienošana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="name" name="name" required minlength="4">
        </div>
        <div class="form-group">
            <label>Links</label>
            <input class="form-control" type="text" id="link" name="link" required>
        </div>
        <div class="ImageUploader">
            @csrf
            <div class="row">
                <div class="col-md-6">
                    <label>Bilde</label>
                    <input type="file" name="image" id="uploaded-image" class="form-control">
                </div>
            </div>
        </div>
    </div>
    <button class="btn btn-outline-primary my-2 my-sm-0" id="save-fish" type="submit">Pievienot</button>
    <script src="{{ asset('js/fish/uploader.js')  }}"></script>
@endsection
    <b></b>
