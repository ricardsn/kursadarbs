@extends('layout.mainlayout')

@section('content')
    <div class="form-container">
        @csrf
        <h3>Mans profils</h3>
        <div class="form-group">
            <label>Vārds</label>
            <input class="form-control" type="text" id="name" name="name" required minlength="4" readonly value="{{ $user->name  }}">
        </div>
        <div class="form-group">
            <label>E-pasts</label>
            <input class="form-control" type="email" id="email" name="email" required readonly value="{{ $user->email }}">
        </div>
        @if(!$user->image)
        <form class="ImageUploader" action="{{ route('uploadImage')  }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="col-md-6">
                    <label>Bilde</label>
                    <input type="file" name="image" id="uploaded-image" class="form-control">
                </div>
                <div class="col-md-auto">
                    <button class="btn btn-outline-primary my-2 my-sm-0" type="submit" id="upload-profile">Pievienot</button>
                </div>
            </div>
        </form>
        @else
            <div class="form-group">
                <h3>Profila bilde:</h3>
                <div class="col d-flex align-items-center justify-content-center">
                    <img src="{{sprintf('%s/%s', asset('/images/profile/'),$user->image) }}" style="width: 400px; height: 200px;">
                </div>
            </div>
        @endif
    </div>
@endsection
