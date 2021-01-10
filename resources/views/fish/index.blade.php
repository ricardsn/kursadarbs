@extends('layout.mainlayout')
@section('content')
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Zivs</th>
            <th scope="col">Bilde</th>
            <th scope="col">Izveidots</th>
            <th scope="col">Atjaunots</th>
            <th scope="col">Opcijas</th>
        </tr>
        </thead>
        <tbody>
        @foreach($fishes as $fish)
            <tr>
                <td>{{ $fish->name }}</td>
                <td><img src="{{ asset(sprintf('/images/fishes/%s',$fish->image))  }}" style="height: 100px; width: 200px;" alt="fish image"></td>
                <td>{{ $fish->created_at }}</td>
                <td>{{ $fish->updated_at }}</td>
                <td>
                    <form action="{{ route('fish.destroy',$fish->id) }}" method="POST">
                        <a href="{{ sprintf('%s/%s', \Illuminate\Support\Facades\URL::to('/fish'), $fish->id)  }}" class="btn btn-success">Apskatīt</a>
                        @auth()
                            @if(Auth::user()->role == 'administrator')
                                <a href="{{ sprintf('%s/%s/%s', \Illuminate\Support\Facades\URL::to('/fish'), $fish->id,'edit')  }}" class="btn btn-info">Rediģēt</a>
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
@endsection
<b></b>
