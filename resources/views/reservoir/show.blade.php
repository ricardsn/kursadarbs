@extends('layout.mainlayout')
@section('content')
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
        </tr>
        </thead>
        <tbody>
        @foreach($coordinates as $coordinate)
            <tr>
                <td>{{ $coordinate->id }}</td>
                <td>{{ $coordinate->name }}</td>
                <td>{{ $coordinate->lat }}</td>
                <td>{{ $coordinate->long }}</td>
                <td>{{ $coordinate->type }}</td>
                <td>{{ $coordinate->created_at }}</td>
                <td>{{ $coordinate->updated_at }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
@endsection
<b></b>
