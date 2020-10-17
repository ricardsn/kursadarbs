define([
    'jquery',
    'leaflet',
    'esri-leaflet',
    'esri-leaflet-geocoder',
    './vendor/bootstrap-geocoder',
    './vendor/leaflet.geometryutil',
    'leaflet.markercluster'
], function(
    $,
    L,
    esri,
    geocoder,
    BootstrapGeocoder,
    geometryutil,
) {
    "use strict";
    let mymap = L.map('mapid').setView([56.9496, 24.1052], 7);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicmljYXJkc24iLCJhIjoiY2tnY2xmODJmMDdwbDJ4cXgxZmI0NjIwYyJ9.HpPK7-zynFDLXr3Akf4B1A'
    }).addTo(mymap);

    let customIcon = L.icon({
        iconUrl: 'images/vendor/leaflet/dist/marker-icon.png',

        iconSize: [20, 30], // size of the icon
        iconAnchor: [16, 30], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -30] // point from which the popup should open relative to the iconAnchor
    });

    $.ajax({

        url: 'map/show',
        dataFormat: 'json',
        data: {
            page: 1,
            distance: 10000,
            lat: 56.9,
            lon: 24.2,
            bounds: {
                'lat_max': 90,
                'lng_max': 180,
                'lat_min': -90,
                'lng_min': -180
            },
            lastIndex: 1
        },
        success: function (data) {
            let reservoirs = data;
            // let countryStores = stores;
            // let selectedCountry = 'All';
            // let selectedCountryCode = '';
            $.each(reservoirs, function (index, reservoir) {
                /*map.addLayer(markers);
                addToList(store);*/
                addStoreToMap(reservoir);
            });
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function addStoreToMap(reservoir) {

        let marker = L.marker([reservoir['lat'], reservoir['long']], {icon: customIcon}).bindPopup(reservoir['name'] + reservoir['type']).addTo(mymap);

        // markers.addLayer(marker);
        // posMarkers.push([parseFloat(store['latitude']),parseFloat(store['longitude'])]);
    }

    let search = BootstrapGeocoder.search({
        inputTag: 'address-search',
        placeholder: 'To find nearest store, enter your address here...',
        zoomToResult: true,
        useMapBounds: false,
        allowMultipleResults: false
    }).addTo(mymap);
});
