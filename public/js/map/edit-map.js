/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/jquery/dist/jquery.js":
/*!********************************************!*\
  !*** ./node_modules/jquery/dist/jquery.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open 'C:\\wamp64\\www\\KursaDarbs_rn18011\\kursa-darbs\\node_modules\\jquery\\dist\\jquery.js'");

/***/ }),

/***/ "./node_modules/leaflet/dist/leaflet-src.js":
/*!**************************************************!*\
  !*** ./node_modules/leaflet/dist/leaflet-src.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: ENOENT: no such file or directory, open 'C:\\wamp64\\www\\KursaDarbs_rn18011\\kursa-darbs\\node_modules\\leaflet\\dist\\leaflet-src.js'");

/***/ }),

/***/ "./resources/js/map/edit-map.js":
/*!**************************************!*\
  !*** ./resources/js/map/edit-map.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js"), __webpack_require__(/*! leaflet */ "./node_modules/leaflet/dist/leaflet-src.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, L) {
  "use strict";

  var mymap = L.map('createmap').setView([56.9496, 24.1052], 7);
  var radius = 0;
  var coordinates = [];
  var markers = L.layerGroup();
  var radiusSelector = document.getElementById('radius-select');
  var saveButton = document.getElementById('save-reservoir');
  var url = window.location.pathname.replace('/edit', ''); // let createMap = L.map('createmap').setView([56.9496, 24.1052], 7);

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
    url: "".concat(url, "/getCoordinateEdit"),
    dataFormat: 'json',
    data: {},
    success: function success(data) {
      coordinates = data;
      radius = coordinates[0].radius;
      $.each(coordinates, function (index, coordinate) {
        addStoreToMapLoad(coordinate);
      });
      mymap.addLayer(markers);
    },
    error: function error(err) {
      alert("Error : " + JSON.stringify(err));
    }
  });

  function addStoreToMapLoad(coordinate) {
    var marker = L.circle([coordinate['lat'], coordinate['long']], coordinate['radius']);
    markers.addLayer(marker); // posMarkers.push([parseFloat(store['latitude']),parseFloat(store['longitude'])]);
  }

  saveButton.onclick = function () {
    var name = $('#name').val();
    var lat = $('#lat').val();

    var _long = $('#long').val();

    var radius = $('#radius-select').val();
    var type = $('#type').val();
    var fishes = $('#fish-dropdown').val();
    $.ajax({
      method: "POST",
      url: "".concat(url, "/update"),
      dataType: 'html',
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      data: {
        name: name,
        lat: lat,
        "long": _long,
        radius: radius,
        type: type,
        fishes: fishes,
        coordinates: JSON.stringify(coordinates)
      },
      success: function success(data) {
        alert('Successfully updated!');
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify(jqXHR));
        console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
        alert('Error occured look into console logs');
      }
    });
  };

  mymap.on('click', addMarker);

  function addMarker(e) {
    // Add marker to reservoir at click location
    var newMarker = new L.circle(e.latlng, parseInt(radius)).addTo(mymap);
    markers.addLayer(newMarker);
    coordinates.push(newMarker._latlng);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 4:
/*!********************************************!*\
  !*** multi ./resources/js/map/edit-map.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\wamp64\www\KursaDarbs_rn18011\kursa-darbs\resources\js\map\edit-map.js */"./resources/js/map/edit-map.js");


/***/ })

/******/ });