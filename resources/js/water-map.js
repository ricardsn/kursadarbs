define([
    'jquery',
    'leaflet',
    'esri-leaflet',
    'esri-leaflet-geocoder',
    './vendor/bootstrap-geocoder',
    './vendor/leaflet.geometryutil',
    'leaflet.markercluster'
], function (
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
    const typeSelector = $('#type');
    const searchInput = $('#address-search');
    let radius = 0;
    let location = null;
    let searchButton = document.getElementById('searchButton');
    let reservoirs = null;
    let displayReservoirs = [];
    let coordinates = null;
    let rivers = [];
    let lakes = [];

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
        url: '/reservoir/getCoordinates',
        dataFormat: 'json',
        success: function (data) {
            coordinates = data;
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
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
                addStoreToMapLoad(reservoir);
                if (reservoir.type === 'Ezers') {
                    lakes.push(reservoir);
                } else if (reservoir.type === 'Upe') {
                    rivers.push(reservoir);
                }
            });
            mymap.addLayer(markers);
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function insertLink(id) {
        const link = '<a href="'+ window.location.origin+'/forum/'+id +'">Vairāk informācijas</a>'

        return link;
    }

    function addStoreToMapSearch(reservoir, coordinate) {
        let marker = L.circle([coordinate['lat'], coordinate['long']], coordinate['radius']).bindPopup(reservoir['name'] +'</br>'+ reservoir['type'] + '</br>' + insertLink(reservoir['id']));
        markers.addLayer(marker);
        // posMarkers.push([parseFloat(store['latitude']),parseFloat(store['longitude'])]);
    }

    function addStoreToMapLoad(reservoir) {
        let marker = L.marker([reservoir['lat'], reservoir['long']], {icon: customIcon}).bindPopup(reservoir['name']+ '</br>' + reservoir['type']  + '</br>' + insertLink(reservoir['id']));
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
        searchInput[0].value = data.text;
    });

    function getReservoirCoordinates(reservoir) {
        let reservoirCoordinates = [];

        $.each(coordinates, function (index, coordinate) {
            if (coordinate.reservoir_id === reservoir.id) {
                reservoirCoordinates.push(coordinate);
            }
        });

        return reservoirCoordinates;
    }

    function getDistance(reservoir) { //formula from https://www.movable-type.co.uk/scripts/latlong.html
        //parseFloat(reservoir['lat']), location.lat, parseFloat(reservoir['long']), location.lng
        const reservoirCoordinates = getReservoirCoordinates(reservoir);
        let closestCoordinateDistance = null;
        let closestCoordinate = null;

        $.each(reservoirCoordinates, function (index, coordinate) {
            const lat1 = parseFloat(coordinate['lat']);
            const lat2 = location.lat;
            const lon1 = parseFloat(coordinate['long']);
            const lon2 = location.lng;

            const R = 6371e3;

            const fi1 = lat1 * Math.PI / 180;
            const fi2 = lat2 * Math.PI / 180;
            const dFi = (lat2 - lat1) * Math.PI / 180;
            const dLa = (lon2 - lon1) * Math.PI / 180;

            const a = Math.sin(dFi / 2) * Math.sin(dFi / 2) +
                Math.cos(fi1) * Math.cos(fi2) *
                Math.sin(dLa / 2) * Math.sin(dLa / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const distance = R * c - parseFloat(coordinate['radius']);
            if (closestCoordinateDistance === null) {
                closestCoordinateDistance = distance;
                closestCoordinate = coordinate;
            } else if (closestCoordinateDistance > distance) {
                closestCoordinateDistance = distance;
                closestCoordinate = coordinate;
            }
        });

        const result = {
            coordinate: closestCoordinate,
            distance: closestCoordinateDistance
        };

        return result;
    }

    searchButton.onclick = () => {
        displayReservoirs = [];
        markers.clearLayers();
        let searchedReservoirs = [];
        let selection = typeSelector[0].options;
        markers.addLayer(L.marker(location, {icon: customIcon}).bindPopup('Jūs atrodaties šeit'));
        if (selection[selection.selectedIndex].value === 'Ezers') {
            searchedReservoirs = lakes;
        } else if (selection[selection.selectedIndex].value === 'Upe') {
            searchedReservoirs = rivers;
        }

        $.each(searchedReservoirs, function (index, reservoir) {
            const reservoirDist = getDistance(reservoir);
            if (reservoirDist.distance <= radius * 1000) { //parseFloat(reservoir['lat']), location.lat, parseFloat(reservoir['long']), location.lng
                displayReservoirs.push(reservoir);
                addStoreToMapSearch(reservoir, reservoirDist.coordinate);
            }
        });

        mymap.addLayer(markers);
    };

    function addAllReservoirsToMap() {
        markers.clearLayers();
        $.each(reservoirs, function (index, reservoir) {
            addStoreToMapLoad(reservoir);
        });
        mymap.addLayer(markers);
    }
});
