define([
    'jquery',
    'leaflet',
], function(
    $,
    L,
) {
    "use strict";
    let mymap = L.map('createmap').setView([56.9496, 24.1052], 7);
    let radius = 0;
    let coordinates = [];
    let markers = L.layerGroup();
    const radiusSelector = document.getElementById('radius-select');
    const saveButton = document.getElementById('save-reservoir');
    const url = window.location.pathname.replace('/edit','');
    // let createMap = L.map('createmap').setView([56.9496, 24.1052], 7);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicmljYXJkc24iLCJhIjoiY2tnY2xmODJmMDdwbDJ4cXgxZmI0NjIwYyJ9.HpPK7-zynFDLXr3Akf4B1A'
    }).addTo(mymap);

    radiusSelector.onchange = setRadius;

    mymap.addLayer(markers);

    function setRadius() {
        coordinates = [];
        markers.clearLayers();
        radius = radiusSelector.value;
    }

    $.ajax({
        url: `${url}/getCoordinateEdit`,
        dataFormat: 'json',
        data: {

        },
        success: function (data) {
            coordinates = data;
            radius = coordinates[0].radius;
            $.each(coordinates, function (index, coordinate) {
                addStoreToMapLoad(coordinate);
            });
            mymap.addLayer(markers);
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function addStoreToMapLoad(coordinate) {
        let marker = L.circle([coordinate['lat'], coordinate['long']], coordinate['radius']);
        markers.addLayer(marker);
        // posMarkers.push([parseFloat(store['latitude']),parseFloat(store['longitude'])]);
    }

    saveButton.onclick = () => {
        const name = $('#name').val();
        const lat = $('#lat').val();
        const long = $('#long').val();
        const radius = $('#radius-select').val();
        const type = $('#type').val();
        const fishes = $('#fish-dropdown').val();

        $.ajax({
            method: "POST",
            url:  `${url}/update`,
            dataType: 'html',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: {
                name: name,
                lat: lat,
                long: long,
                radius: radius,
                type: type,
                fishes: fishes,
                coordinates: JSON.stringify(coordinates)
            },
            success: function(data) {
                alert('Successfully updated!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });

    };

    mymap.on('click', addMarker);
    function addMarker(e){
        // Add marker to reservoir at click location
        var newMarker = new L.circle(e.latlng, parseInt(radius)).addTo(mymap);
        markers.addLayer(newMarker);
        coordinates.push(newMarker._latlng);
    }
});
