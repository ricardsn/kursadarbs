define([
    'jquery',
    'leaflet',
], function(
    $,
    L,
) {
    "use strict";
    let mymap = L.map('createmap').setView([56.9496, 24.1052], 7);
    let coordinates = [];
    let markers = L.layerGroup();
    const url = window.location.pathname.replace('/showSingleReservoir','');
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicmljYXJkc24iLCJhIjoiY2tnY2xmODJmMDdwbDJ4cXgxZmI0NjIwYyJ9.HpPK7-zynFDLXr3Akf4B1A'
    }).addTo(mymap);

    mymap.addLayer(markers);

    $.ajax({
        url: `${url}/getCoordinateEdit`,
        dataFormat: 'json',
        data: {

        },
        success: function (data) {
            coordinates = data;
            $.each(coordinates, function (index, coordinate) {
                addStoreToMapLoad(coordinate);
            });
            mymap.addLayer(markers);
            if(!(coordinates.length > 300)) {
                mymap.setView([coordinates[0]['lat'], coordinates[0]['long']], 10);
            }
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function addStoreToMapLoad(coordinate) {
        let marker = L.circle([coordinate['lat'], coordinate['long']], coordinate['radius']);
        markers.addLayer(marker);
    }
});
