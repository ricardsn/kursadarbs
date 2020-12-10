@extends('layout.mainlayout')
@section('content')
    <div class="album text-muted">
        <div class="container"  id="index-map">
            <div class="row">
                <div id="mapid"></div>
                <div class="search-content">
                    <input id="address-search"/>
                    <select class="type-select" name="type" id="type" required>
                        <option value="" disabled selected>Izvēlieties tipu</option>
                        <option value="Ezers">Ezers</option>
                        <option value="Upe">Upe</option>
                    </select>
                    <select class="mdb-select md-form" id="radius-selector">
                        <option value="" disabled selected>Izvēlieties meklēšanas radiusu</option>
                        <option value="25">~25 km</option>
                        <option value="50">~50 km</option>
                        <option value="100">~100 km</option>
                        <option value="All">Parādīt visus</option>
                    </select>
                    <button type="button" class="btn btn-success" id="searchButton">Meklēt</button>
                </div>
            </div>
        </div>
    </div>
@endsection
<b></b>
