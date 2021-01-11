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

    function setRadius() { //clear markers if radius is changed
        coordinates = [];
        markers.clearLayers();
        radius = radiusSelector.value;
    }

    function validate(name, lat, long, radius, type, fishes) { //validate create data
        const nameValidator = new RegExp(/^[a-žA-Ž\s]+$/) //consists only from letters
        const errorMsg = [];

         if (name.length < 3) {
            errorMsg.push('Ūdenstilpnes nosaukumam ir jābūt vismaz 3 burtu garam.');
         }

         if (!nameValidator.test(name)) {
             errorMsg.push('Ūdenstilpnes nosaukumam ir jāsatur no latīniskiem burtiem.');
         }

         if (!$.isNumeric(lat) || !$.isNumeric(long)) { //is decimal
             errorMsg.push('Ūdenstilpnes koordinātēm ir jābūt decimālskaitlim.');
         }

         if (Number.isInteger(radius) || radius < 1) { //natural digit
             errorMsg.push('Rādiuss nav naturāls skaitlis.');
         }

         if (type !== 'Ezers' && type !== 'Upe') {
             errorMsg.push('Izvēlētais tips nav atpazīts.');
         }

         if(coordinates.length < 1) {
             errorMsg.push('Neviena koordināte nav pievienota.');
         }

         if (fishes.length < 1) {
             errorMsg.push('Neviena zivs nav pievienota.');
         }

         return errorMsg;
    }

    saveButton.onclick = () => {
        saveReservoir();
    };

    function saveReservoir() {
        const name = $('#name').val();
        const lat = $('#lat').val();
        const long = $('#long').val();
        const radius = $('#radius-select').val();
        const type = $('#type').val();
        const fishes = $('#fish-dropdown').val();
        const errorContainer = $('#js-errors');
        const errorMsg = validate(name, lat, long, radius, type, fishes);

        errorContainer.html(''); //clearing error messages

        if(errorMsg.length !== 0) { //displaying error msg if any
            let message = '';

            $.each(errorMsg, function (index, error) {
                message += error + '<br />';
            });
            errorContainer.html(message);
            return;
        }

        $.ajax({ //sending reservoir data to controller
            method: "POST",
            url: "/reservoir/saveCoordinates",
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
                alert('Ūdenstilpne veiksmīgi saglabāta!');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(JSON.stringify(jqXHR));
                console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                alert('Error occured look into console logs')
            }
        });

    }

    mymap.on('click', addMarker);

    function addMarker(e){
    // Add marker to reservoir at click location; add popup window
        let newMarker = new L.circle(e.latlng, parseInt(radius)).addTo(mymap);
        markers.addLayer(newMarker);
        coordinates.push(newMarker._latlng);
    }
});
