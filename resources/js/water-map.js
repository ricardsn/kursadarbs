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
    }).addTo(mymap); //initializing map

    let customIcon = L.icon({
        iconUrl: 'images/vendor/leaflet/dist/marker-icon.png',

        iconSize: [20, 30], // size of the icon
        iconAnchor: [16, 30], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -30] // point from which the popup should open relative to the iconAnchor
    });

    $.ajax({ //retrieving coordinate data
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
            $.each(reservoirs, function (index, reservoir) { //splitting reservoirs into two groups - lakes and rivers
                addReservoirToMapLoad(reservoir);
                if (reservoir.type === 'Ezers') {
                    lakes.push(reservoir);
                } else if (reservoir.type === 'Upe') {
                    rivers.push(reservoir);
                }
            });
            mymap.addLayer(markers); //displaying reservoirs
        },
        error: function (err) {
            alert("Error : " + JSON.stringify(err));
        }
    });

    function insertLink(id) { //adding link to marker
        const link = '<a href="'+ window.location.origin+'/forum/'+id +'">Vairāk informācijas</a>'

        return link;
    }

    function addReservoirToMapSearch(reservoir, coordinate) { //displaying closest marker with data
        let marker = L.circle([coordinate['lat'], coordinate['long']], coordinate['radius']).bindPopup(reservoir['name'] +'</br>'+ reservoir['type'] + '</br>' + insertLink(reservoir['id']));
        markers.addLayer(marker);
    }

    function addReservoirToMapLoad(reservoir) { //displaying reservoir marker with data on load
        let marker = L.marker([reservoir['lat'], reservoir['long']], {icon: customIcon}).bindPopup(reservoir['name']+ '</br>' + reservoir['type']  + '</br>' + insertLink(reservoir['id']));
        markers.addLayer(marker);
    }

    let search = BootstrapGeocoder.search({ //adding to map search from plugin
        inputTag: 'address-search',
        placeholder: 'To find nearest store, enter your address here...',
        zoomToResult: false,
        useMapBounds: false,
        allowMultipleResults: false
    }).addTo(mymap);

    selector.change(() => { //updating radius data
        let selection = selector[0].options;

        if (selection[selection.selectedIndex].value !== 'All') {
            radius = selection[selection.selectedIndex].value;
        } else {
            radius = 0;
            addAllReservoirsToMap();
        }
    });

    search.on('results', function (data) { //getting coordinates of searched address
        location = data.latlng;
        searchInput[0].value = data.text;
    });

    function getReservoirCoordinates(reservoir) { //returning all coordinates of specific reservoir
        let reservoirCoordinates = [];

        $.each(coordinates, function (index, coordinate) {
            if (coordinate.reservoir_id === reservoir.id) {
                reservoirCoordinates.push(coordinate);
            }
        });

        return reservoirCoordinates;
    }

    function getDistance(reservoir) { //formula from https://www.movable-type.co.uk/scripts/latlong.html
        const reservoirCoordinates = getReservoirCoordinates(reservoir); //retrieving all specific reservoir coordinates
        let closestCoordinateDistance = null;
        let closestCoordinate = null;

        $.each(reservoirCoordinates, function (index, coordinate) { //getting closest coordinate from specific reservoir
            const lat1 = parseFloat(coordinate['lat']);   //getting coordinates of searched location and reservoirs coordinate
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

            const distance = R * c - parseFloat(coordinate['radius']); //calculating distance in meters with Harvesine forumla
            if (closestCoordinateDistance === null) { //with comparing finds closest coordinate of reservoir
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

        return result; //returning closest coordinate of specific reservoir
    }

    function validate(select, address, radius) { //validating search input
        let errorMsg = [];
        const selection = select[select.selectedIndex].value;

        if (selection !== 'Ezers' && selection !== 'Upe') {
            errorMsg.push('Tips neeksistē sistēmas izvēlnē.');
        }

        if (address.val() === '') {
            errorMsg.push('Adrese ir obligāta');
        }

        if (Number.isInteger(radius) || radius < 1) {
            errorMsg.push('Rādiuss nav naturāls skaitlis.');
        }

        return errorMsg;
    }

    searchButton.onclick = () => {
        startSearch();
    }

    function startSearch() {
        markers.clearLayers();
        let searchedReservoirs = [];
        let selection = typeSelector[0].options;
        const errorContainer = $('#js-errors');
        const errorMsg = validate(selection,searchInput, radius); //validate befor search

        errorContainer.html('');

        if(errorMsg.length !== 0) { //adding validation error messages if any
            let message = '';

            $.each(errorMsg, function (index, error) {
                message += error + '<br />';
            });
            errorContainer.html(message);
            return;
        }

        markers.addLayer(L.marker(location, {icon: customIcon}).bindPopup('Jūs atrodaties šeit')); //displaying location of search in map
        if (selection[selection.selectedIndex].value === 'Ezers') {
            searchedReservoirs = lakes;
        } else if (selection[selection.selectedIndex].value === 'Upe') {
            searchedReservoirs = rivers;
        }

        $.each(searchedReservoirs, function (index, reservoir) { //comparing each reservoirs closest coordinate with radius if it fits in it is added to map
            const reservoirDist = getDistance(reservoir);
            if (reservoirDist.distance <= radius * 1000) {
                addReservoirToMapSearch(reservoir, reservoirDist.coordinate);
            }
        });

        mymap.addLayer(markers);
    }

    function addAllReservoirsToMap() { //display all reservoir markers
        markers.clearLayers();
        $.each(reservoirs, function (index, reservoir) {
            addReservoirToMapLoad(reservoir);
        });
        mymap.addLayer(markers);
    }
});
