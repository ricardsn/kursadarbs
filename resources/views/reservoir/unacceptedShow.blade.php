@extends('layout.mainlayout')
@section('content')
    @if(!empty($reservoirs->all()))
        <table class="table">
            <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Nosaukums</th>
                <th scope="col">Platums</th>
                <th scope="col">Garums</th>
                <th scope="col">Tips</th>
                <th scope="col">Izveidots</th>
                <th scope="col">Atjaunots</th>
                <th scope="col">Opcijas</th>
            </tr>
            </thead>
            <tbody>
            @foreach($reservoirs as $reservoir)
                <tr>
                    <td>{{ $reservoir->id }}</td>
                    <td>{{ $reservoir->name }}</td>
                    <td>{{ $reservoir->lat }}</td>
                    <td>{{ $reservoir->long }}</td>
                    <td>{{ $reservoir->type }}</td>
                    <td>{{ $reservoir->created_at }}</td>
                    <td>{{ $reservoir->updated_at }}</td>
                    <td>
                        <form action="{{ route('reservoir.destroy',$reservoir->id) }}" method="POST">
                            <a href="{{ sprintf('%s/%s/%s', \Illuminate\Support\Facades\URL::to('/reservoir'), $reservoir->id,'showSingleReservoir')  }}" class="btn btn-success">Apskatīt</a>
                            @auth
                                @if(Auth::user()->role == 'administrator')
                                    <a href="{{ sprintf('%s/%s/%s', \Illuminate\Support\Facades\URL::to('/reservoir'), $reservoir->id,'edit')  }}" class="btn btn-info">Rediģēt</a>
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger">Dzēst</button>
                                @endif
                            @endauth
                        </form>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    @else
        <div class="alert alert-danger">Datubāzē nav ieteikto ūdenstilpņu dati.</div>
    @endif
@endsection
<b></b>
