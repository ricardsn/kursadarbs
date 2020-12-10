@extends('layout.mainlayout')
@section('content')
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Forums</th>
            <th scope="col">Izveidots</th>
            <th scope="col">Atjaunots</th>
            <th scope="col">Opcijas</th>
        </tr>
        </thead>
        <tbody>
        @foreach($forums as $forum)
            <tr>
                <td>{{ $forum->title }}</td>
                <td>{{ $forum->created_at }}</td>
                <td>{{ $forum->updated_at }}</td>
                <td>
                    <form action="{{ route('forum.destroy',$forum->id) }}" method="POST">
                        <a href="{{ sprintf('%s/%s', \Illuminate\Support\Facades\URL::to('/forum'), $forum->reservoir_id)  }}" class="btn btn-success">Apskatīt</a>
                        <a href="{{ sprintf('%s/%s/%s', \Illuminate\Support\Facades\URL::to('/forum'), $forum->id,'edit')  }}" class="btn btn-info">Rediģēt</a>
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger">Dzēst</button>
                    </form>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection
<b></b>
