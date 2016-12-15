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
  var mymap = L.map('mapid').setView([51.4, 9], 2);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'hoelsch.e2b0812b',
      accessToken: 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ'}).addTo(mymap);
  var popup = L.popup();

  //boxDistance ist undefined
  var helloPopup = L.popup().setContent(("Die Entfernung zur Sensebox beträgt: " + boxDistance + " Km" ));
  //TO-DO
  L.easyButton('glyphicon-ok', function(){
      helloPopup.setLatLng(mymap.getCenter()).openOn(mymap);
  }).addTo(mymap);

  //TO-DO neue Daten geladen Nachricht  + addieren der Punkte + speichern der Punkte
  L.easyButton('fa-repeat', function(){randomize(boxId, $http)}).addTo(mymap);

  function onMapClick(e) {

  popup
  .setLatLng(e.latlng)
  .setContent("Die Entfernung zur Sensebox beträgt: " + ((L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)) + " Km" )
  .openOn(mymap);
  boxDistance = (L.latLng(e.latlng).distanceTo([latbox, longbox]) / 1000).toFixed(2)
  console.log(boxDistance);
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

  mymap.on('click', onMapClick);




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

         /*if abfrage wenn das datum "kleiner" als 11.11.16 ist dann soll er nochmal eine box
        suchen, oder beim fall eines undefined, problem ist, der findet manchmal immer noch
        boxen mit nem kleinerem datum
        TO-DO indoor boxen auschließen
        */

        if(response.data.sensors === undefined ||
           response.data.sensors[0].hasOwnProperty("lastMeasurement") == false ||
           response.data.sensors[0].lastMeasurement == null ||
           response.data.sensors[0].lastMeasurement.createdAt<=isoOneWeekAgo
           ){
                randomize(boxId, $http);
            }

        else{
            console.log("sucess");

        //übergebene Koordinaten für clickevent zur Berechnung
              latbox = response.data.loc[0].geometry.coordinates[1];
              longbox = response.data.loc[0].geometry.coordinates[0];
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
        function onMapClick(e, latbox, longbox){

        }

    }, function myError(response) {
        console.log(response);

    });
  }


});


// button click "JA" randomize aufrufen
// button nein speicher und zu sensebox
