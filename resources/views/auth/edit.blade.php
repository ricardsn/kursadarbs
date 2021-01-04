@extends('layout.mainlayout')
@section('content')
    <div class="form-container">
        <h4 class="alert-success" id="success" style="display: none">Profils tika atjaunots.</h4>
        @csrf
        <h3>Lietotāja rediģēšana</h3>
        <div class="form-group">
            <label>Vārds</label>
            <input class="form-control" type="text" id="name" name="name" required minlength="4" value="{{ $user->name }}">
        </div>
        <div class="form-group">
            <label>E-pasts</label>
            <input class="form-control" type="email" id="email" name="email" required value="{{ $user->email }}">
        </div>
        <div class="form-group" id="change">
            <img src="{{ asset(sprintf('/images/profile/%s', $user->image))  }}" style="width: 400px; height: 200px; margin: auto" alt="fish image">
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
        <button class="btn btn-outline-primary my-2 my-sm-0" id="save-user" type="submit">Saglabāt</button>
    </div>
    <script src="{{ asset('js/profile/edit.js')  }}"></script>
@endsection
<b></b>
