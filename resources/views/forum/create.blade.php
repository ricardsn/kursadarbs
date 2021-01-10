@extends('layout.mainlayout')
@section('content')
    <form class="form-container" method="POST" action="{{  route('forum.store') }}">
        @csrf
        <h3>Foruma pievienošana</h3>
        <div class="form-group">
            <label>Nosaukums</label>
            <input class="form-control" type="text" id="title" name="title" required minlength="4" value="{{ old('title') }}">
        </div>
        <div class="form-group">
            <label>Apraksts</label>
            <textarea class="form-control" type="text" id="desc" name="desc" required>{{ old('desc') }}</textarea>
        </div>
        <div class="form-group">
            <label>Ūdenstilpne</label>
            <select class="type-select" name="reservoir" id="reservoir" required>
              @if($possibleForms != [])
                  @foreach($possibleForms as $reservoir)
                     <option value="{{ $reservoir->id }}" {{ $reservoir->id == old('reservoir') ? 'selected="selected"' :''  }}>
                         {{ $reservoir->name  }}
                     </option>
                   @endforeach
              @endif
            </select>
        </div>
        <button class="btn btn-outline-primary my-2 my-sm-0" id="save-reservoir" type="submit">Pievienot</button>
@endsection
<b></b>
