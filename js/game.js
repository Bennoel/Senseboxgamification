"use strict";

var latbox;
var longbox;
var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
var isoOneWeekAgo = oneWeekAgo.toISOString();
var boxId = [];

//gibt uns alle Boxen aus, ruft die randomize funktion auf um eine Random Box rauszugeben
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $scope.box = [];
  $scope.distance = [];
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
  var boxDistance;
  /*
      Map-function
  */
  var mymap = L.map('mapid').setView([51.4, 9], 2);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'hoelsch.e2b0812b',
      accessToken: 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ'}).addTo(mymap);
  var popup = L.popup();

  function addMarker(e){
// Add marker to map at click location; add popup window
var newMarker = new L.marker(e.latlng).addTo(mymap);
}
  /*
    OnMapClick function defines what happnes when the user clicks on the map.
  */

  function onMapClick(e) {

  popup
  .setLatLng(e.latlng)
  .setContent("Die Entfernung zur Sensebox beträgt: " + ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)) + " Km" )
  .openOn(mymap);
  $scope.distance = (L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)
  console.log("l33337 Test  "+$scope.distance);
  // punkte einteilung

      if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))< 50)
        {
          console.log("100 punkte");
        }
      if (((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))<100 && ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2))>50)
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
      //reload();
  }
$scope.distance = boxDistance;
console.log("heiiiide " + boxDistance)

    // Marker Button to draw players guess. TO-DO Set Game-Marker
L.easyButton('glyphicon-map-marker', function(){}).addTo(mymap);
    //Show MSG with distance to sensebox and reached points.
    var helloPopup = L.popup().setContent(("Die Entfernung zur Sensebox beträgt: " + $scope.distance + " Km" ));
    //Button to enter the guess. TO-DO Draw Line between Sensebox-Marker and Game-Marker. Show reached points. Add points to account
L.easyButton('glyphicon-ok', function(){
    helloPopup.setLatLng(mymap.getCenter()).openOn(mymap);
}).addTo(mymap);

    //Button to set a new game. TO-DO 1. MSG:"New Game loaded" 2. Delete last Game-Marker
L.easyButton('fa-repeat', function(){randomize(boxId, $http)}).addTo(mymap);

mymap.on('click', onMapClick);
  /**
      Searches a new random box and starts the function GameBox
  */

  function randomize(boxId, http){
     var gameBoxId = boxId[Math.floor(Math.random()*boxId.length)];  //find a random index in the Array boxId which consists of every box-id
      gameBox(gameBoxId, http); //Starts the function gameBox
      };
  /**
      Gets the data as a JSON of a certain box
  */
    function gameBox(gameBoxId, $http){
    $http({
      method : "GET",
      url : "https://api.opensensemap.org/boxes/"+gameBoxId
    }).then(function mySucces(response){

         /*
          If the boxe are not working or too old, find a new box and try it again.
        */

        if(response.data.sensors === undefined ||
           response.data.sensors[0].hasOwnProperty("lastMeasurement") == false ||
           response.data.sensors[0].lastMeasurement == null ||
           response.data.sensors[0].lastMeasurement.createdAt<=isoOneWeekAgo
           ){
                randomize(boxId, $http); // finding a new box
            }

        else{
              console.log("sucess"); //the found box is okay.
              latbox = response.data.loc[0].geometry.coordinates[1];   //getting the latitude
              longbox = response.data.loc[0].geometry.coordinates[0];  //getting the longitude
        /*
            Getting the box's latest measurements
        */
        var sensors = [];

        for(var i=0; i < response.data.sensors.length; i++){
            var sensor = {};
            sensor.title = response.data.sensors[i].title;
            sensor.value = response.data.sensors[i].lastMeasurement.value;
            sensor.unit = response.data.sensors[i].unit;
            sensors.push(sensor);
        }
        $scope.box = sensors;

            }

    }, function myError(response) {
        console.log(response);

    });
  }


});
