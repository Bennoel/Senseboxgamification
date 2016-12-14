"use strict";
var latbox;
var longbox;
var mymap = L.map('mapid').setView([51.4, 9], 6);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'hoelsch.e2b0812b',
    accessToken: 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ'}).addTo(mymap);
var popup = L.popup();
function onMapClick(e) {
popup
.setLatLng(e.latlng)
.setContent("Die Entfernung zur Sensebox beträgt: " + ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)) + " Km" )
.openOn(mymap);
// punkte einteilung

if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))< 50)
    {
        console.log("100 punkte");
    }
if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))<100 &&
   ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))>50)
    {
        console.log("50 punkte");
    }
if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))<150 && ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)) >100  )
    {
        console.log("10 Punkte");
    }
if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))>150 ){
    console.log("keine punkte für dich");
}

}mymap.on('click', onMapClick);
//gibt uns alle Boxen aus, ruft die randomize funktion auf um eine Random Box rauszugeben
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.boxes = {};
  var boxId = [];
  var gameBoxId = [];
  $http({
    method : "GET",
    url : "https://api.opensensemap.org/boxes?"
  }).then(function mySucces(response) {
      $scope.myData = response.data;
      for(var i in response.data){
        boxId.push(response.data[i]._id);
      }
      randomize(boxId, $http);
    }, function myError(response) {
      $scope.myData = response.statusText;
  });
});
//sucht eine Randombox aus und übergibt das dann der funktion gameBox
//übergebene boxId
function randomize(boxId, http){
   var gameBoxId = boxId[Math.floor(Math.random()*boxId.length)];
    console.log('RandomBoxId: ' + gameBoxId);
    gameBox(gameBoxId, http);
    };
function gameBox(gameBoxId, $http){
  $http({
    method : "GET",
    url : "https://api.opensensemap.org/boxes/"+gameBoxId
  }).then(function mySucces(response){

      console.log(response.data.loc[0].geometry.coordinates[0]);
      console.log(response.data.loc[0].geometry.coordinates[1]);

      //datum von der letzten messung
      console.log(response.data.sensors[1].lastMeasurement.createdAt);
      /*if abfrage wenn das datum "kleiner" als 11.11.16 ist dann soll er nochmal eine box
      suchen, oder beim fall eines undefined, problem ist, der findet manchmal immer noch
      boxen mit nem kleinerem datum
      */

    /*  if(response.data.sensors[1].lastMeasurement.createdAt < 2016-11-11 ||
         response.data.sensors[1].lastMeasurement.createdAt == undefined)
          {
              randomize(gameBoxId, $http);
          }
      */

      //übergebene Koordinaten für clickevent zur Berechnung
      latbox = response.data.loc[0].geometry.coordinates[1];
      longbox = response.data.loc[0].geometry.coordinates[0];
      function onMapClick(e, latbox, longbox){

      }

  }, function myError(response) {
      console.log(response);

  });
}
