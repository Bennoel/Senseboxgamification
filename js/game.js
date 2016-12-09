"use strict";

var mymap = L.map('mapid').setView([51.9606649, 7.6161347], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'hoelsch.e2b0812b',
    accessToken: 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ'}).addTo(mymap);
var popup = L.popup();
function onMapClick(e) {
popup
.setLatLng(e.latlng)
.setContent("Die Entfernung zur Sensebox beträgt: " + ((L.latLng(e.latlng).distanceTo([49.201332, 10.367305]) / 1000).toFixed(3)) + " Km" )
.openOn(mymap);
L.latLng([48.201332, 16.367305]).distanceTo([49.201332, 10.367305]);
}
mymap.on('click', onMapClick);


var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $http({
    method : "GET",
    url : "https://api.opensensemap.org/boxes?"
  }).then(function mySucces(response) {
      $scope.myData = response.data;
    }, function myError(response) {
      $scope.myData = response.statusText;
  });
});
