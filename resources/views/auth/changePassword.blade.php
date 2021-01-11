@extends('layout.mainlayout')

@section('content')
    <form class="form-container" action="{{ route('saveNewPassword')  }}" method="POST">
        @csrf
        <h3>Mainīt paroli</h3>
        <div class="form-group">
            <label>Tagadējā parole</label>
            <input class="form-control" type="password" id="curr_password" name="curr_password">
        </div>
        <div class="form-group">
            <label>Jaunā parole</label>
            <input class="form-control" type="password" id="new_password" name="new_password">
        </div>
        <button class="btn btn-success" type="submit">Saglabāt</button>
    </form>
@endsection
