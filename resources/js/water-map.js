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
    BootstrapGeocoder
) {
    "use strict";
    let mymap = L.map('mapid').setView([56.9496, 24.1052], 7);
    let markers = L.markerClusterGroup();
    const selector = $('#radius-selector');
    let radius = 0;
    let location = null;
    let searchButton = document.getElementById('searchButton');
    let reservoirs = null;
    let displayReservoirs = [];

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
        url: '/reservoir/show',
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
            reservoirs = data;
            $.each(reservoirs, function (index, reservoir) {
                addStoreToMap(reservoir);
            });
            mymap.addLayer(markers);
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function addStoreToMap(reservoir) {

        let marker = L.marker([reservoir['lat'], reservoir['long']], {icon: customIcon}).bindPopup(reservoir['name'] + reservoir['type']);
        markers.addLayer(marker);
        // posMarkers.push([parseFloat(store['latitude']),parseFloat(store['longitude'])]);
    }

    let search = BootstrapGeocoder.search({
        inputTag: 'address-search',
        placeholder: 'To find nearest store, enter your address here...',
        zoomToResult: false,
        useMapBounds: false,
        allowMultipleResults: false
    }).addTo(mymap);

    selector.change(() => {
        let selection = selector[0].options;

        if (selection[selection.selectedIndex].value !== 'All') {
            radius = selection[selection.selectedIndex].value;
        } else {
            radius = 0;
            addAllReservoirsToMap();
        }
    });

    search.on('results', function (data) {
        location = data.latlng;
    });

    function getDistance(lat1, lat2, lon1, lon2){ //formula from https://www.movable-type.co.uk/scripts/latlong.html
        const R = 6371e3;
        const fi1 = lat1 * Math.PI/180;
        const fi2 = lat2 * Math.PI/180;
        const dFi = (lat2-lat1) * Math.PI/180;
        const dLa = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(dFi/2) * Math.sin(dFi/2) +
            Math.cos(fi1) * Math.cos(fi2) *
            Math.sin(dLa/2) * Math.sin(dLa/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return  R * c;
    }

    searchButton.onclick = () => {
        displayReservoirs = [];
        markers.clearLayers();
        $.each(reservoirs, function (index, reservoir) {
            if(getDistance(parseFloat(reservoir['lat']), location.lat, parseFloat(reservoir['long']), location.lng) <= radius * 1000) {
                displayReservoirs.push(reservoir);
                addStoreToMap(reservoir);
            }
        });
        mymap.addLayer(markers);
    };

    function addAllReservoirsToMap() {
        markers.clearLayers();
        $.each(reservoirs, function (index, reservoir) {
            addStoreToMap(reservoir);
        });
        mymap.addLayer(markers);
    }

//     mymap.on('click', addMarker);
//     function addMarker(e){
// // Add marker to reservoir at click location; add popup window
//         var newMarker = new L.circle(e.latlng, 1000).addTo(mymap);
//         console.log(e.latlng)
//     }
});
