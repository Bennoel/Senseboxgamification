"use strict";

var firstpolyline;
var latbox;
var punkte = 0;
var punkteGesamt = 0;
var longbox;
var marker = null;
var ergebnis = null;
var popup = L.popup();
var boxDistance;
var oneHourAgo = new Date();
oneHourAgo.setHours(oneHourAgo.getHours() - 1);
var isoOneHourAgo = oneHourAgo.toISOString();
var boxId = [];
var position;
var pointB = [];
var Runde = 0;
var Punktezählen = 0;

var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//aufrufen der karte
var mymap = L.map('mapid').setView([51.4, 9], 4);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'hoelsch.e2b0812b',
    accessToken: 'pk.eyJ1IjoiaG9lbHNjaCIsImEiOiJxblpwakZrIn0.JTTnLszkIJB11k8YEe7raQ'
}).addTo(mymap);

//gibt uns alle Boxen aus, ruft die randomize funktion auf um eine Random Box rauszugeben
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.box = [];
    $scope.distance = [];
    var gameBoxId = [];

    $http({
        method: "GET",
        url: "https://api.opensensemap.org/boxes?"

    }).then(function mySucces(response) {
        $scope.myData = response.data;
        for (var i in response.data) {
            boxId.push(response.data[i]._id);
        }
        randomize(boxId, $http);
    }, function myError(response) {
        $scope.myData = response.statusText;
    });




    function score() {
        console.log("Die Entfernung zur Sensebox beträgt: " +
            (position.distanceTo([latbox, longbox]) / 1000).toFixed(2) + "Km");
        $scope.distance = (position.distanceTo([latbox, longbox]) / 1000).toFixed(2)
        console.log("l33337 Test  " + $scope.distance);
        // punkte einteilung
        var Distance = (position.distanceTo([latbox,longbox])  / 1000).toFixed(2)

        if ((Distance) < 25) {
            punkte = Number (30);
            punkteGesamt = + punkteGesamt + +30;
        }
        if ((Distance) < 50 && (Distance) > 25) {
            punkte = Number (28);
            punkteGesamt = + punkteGesamt + +28;
        }
        if ((Distance) < 75 && (Distance) > 50) {
            punkte = Number (25);
            punkteGesamt = + punkteGesamt + +25;
        }
        if ((Distance) < 100 && (Distance) > 75) {
            punkte = Number (23);
            punkteGesamt = + punkteGesamt + +23;
        }
        if ((Distance) < 125 && (Distance) > 100) {
            punkte = Number (20);
            punkteGesamt = + punkteGesamt + +20;
        }
        if ((Distance) < 150 && (Distance) > 125) {
            punkte = Number (18);
            punkteGesamt = + punkteGesamt + +18;
        }
        if ((Distance) < 175 && (Distance) > 150) {
            punkte = Number (15);
            punkteGesamt = + punkteGesamt + +15;
        }
        if ((Distance) < 200 && (Distance) > 175) {
            punkte = Number (13);
            punkteGesamt = + punkteGesamt + +13;
        }
        if ((Distance) < 225 && (Distance) > 200) {
            punkte = Number (10);
            punkteGesamt = + punkteGesamt + +10;
        }
        if ((Distance) < 250 && (Distance) > 225) {
            punkte = Number (8);
            punkteGesamt = + punkteGesamt + +8;
        }
        if ((Distance) < 275 && (Distance) > 250) {
            punkte = Number (5);
            punkteGesamt = + punkteGesamt + +5;
        }
        if ((Distance) < 300 && (Distance) > 275) {
            punkte = Number (3);
            punkteGesamt = + punkteGesamt + +3;
        }
        if ((Distance) < 400 && (Distance) > 300) {
            punkte = Number (1);
            punkteGesamt = + punkteGesamt + +1;
        }
        if ((Distance) > 400) {
            punkte = Number (0);
            punkteGesamt = + punkteGesamt + +0;
        }
    };

    
    function ZähleRunde() {
     
     Runde= Runde +1 
     
     if (Runde == 10) {
         alert( "Herzlichen Glückwunsch du hast in 10 Runden" + punkteGesamt + "Punkte gesammelt")
         Runde = 0;
         punkteGesamt = 0;
        }
    
     $("#RundenNummer").text(Runde)
    }
      
    function onMapClick(e) {
        if (marker == null) {
            marker = new L.marker(e.latlng, {
                draggable: false
            });
            mymap.addLayer(marker);
            position = marker.getLatLng();
            pointB = [position.lat, position.lng];
        } else {

            mymap.removeLayer(marker);
            marker = null;
            marker = new L.marker(e.latlng, {
                draggable: false
            });
            position = marker.getLatLng();
            pointB = [position.lat, position.lng];
            mymap.addLayer(marker);
        }
    };
    mymap.on('click', onMapClick);

    $scope.distance = boxDistance;
    console.log("heiiiide " + boxDistance);
    //boxDistance ist undefined

     function Punkteanzeige () {
       Punktezählen= punkteGesamt  

         $("#ergebnis").text(Punktezählen)
         //Function bei den Knöpfen ergenzen(zuhause)
     }

  $("#DrückezumSpielendernächstenRundebtn").click( function () {

        ZähleRunde ()

        mymap.setView([51.4, 9], 5);
        mymap.removeLayer(marker);
        mymap.removeLayer(ergebnis);
        mymap.removeLayer(firstpolyline);
        ergebnis= null;
        randomize(boxId, $http)
         
    })
    mymap.on('click', onMapClick);

        function randomize(boxId, http) {
            var gameBoxId = boxId[Math.floor(Math.random() * boxId.length)];
            console.log('RandomBoxId: ' + gameBoxId);
            gameBox(gameBoxId, http);
            mymap.removeLayer(marker);
            mymap.removeLayer(ergebnis);
            mymap.removeLayer(firstpolyline);
        };
    
        function gameBox(gameBoxId, $http) {
            $http({
                method: "GET",
                url: "https://api.opensensemap.org/boxes/" + gameBoxId
            }).then(function mySucces(response) {

                if (response.data.sensors === undefined ||
                    response.data.sensors[0].hasOwnProperty("lastMeasurement") == false ||
                    response.data.sensors[0].lastMeasurement == null ||
                    response.data.sensors[0].lastMeasurement.createdAt <= isoOneHourAgo||
                    response.data.sensors[0].lastMeasurement.length <= 3 ||
                    response.data.exposure =="indoor"
                ) {
                    randomize(boxId, $http);
                } else {
                    console.log("sucess");
        
                    latbox = response.data.loc[0].geometry.coordinates[1];
                longbox = response.data.loc[0].geometry.coordinates[0];
                var sensors = [];

                for (var i = 0; i < response.data.sensors.length; i++) {
                    var sensor = {};
                    sensor.title = response.data.sensors[i].title;
                    sensor.value = response.data.sensors[i].lastMeasurement.value;
                    sensor.unit = response.data.sensors[i].unit;
                    sensor.lastMeasurement = response.data.sensors[i].lastMeasurement.createdAt;
                    sensors.push(sensor);
                }
                $scope.box = sensors;
            }
            function onMapClick(e, latbox, longbox) {

            }

        }, function myError(response) {
            console.log(response);

        });
    } 
    

    $("#Antwortbtn").click(function() {
        if (ergebnis == null) {
            ergebnis = L.marker([latbox, longbox], {
                icon: greenIcon
            }).addTo(mymap)
        

            score();
            ergebnis.bindPopup("Die Entfernung zur Sensebox beträgt: " +
            (position.distanceTo([latbox, longbox]) / 1000).toFixed(2) + "Km .Du hast " + punkte + " Punkt(e) in dieser Runde erzielt, deine Gesamtpunktzahl ist " + punkteGesamt).openPopup();
            var pointA = [latbox, longbox];
            var pointList = [pointA, pointB];
            console.log(pointA, pointB);


            firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 5,
                opacity: 0.6,
                smoothFactor: 1
            });
            firstpolyline.addTo(mymap);
            mymap.fitBounds(firstpolyline.getBounds());
        } else {
            mymap.removeLayer(ergebnis);
            mymap.removeLayer(firstpolyline);
            ergebnis = L.marker([latbox, longbox], {
                icon: greenIcon
            }).addTo(mymap);
            ergebnis.bindPopup("Die Entfernung zur Sensebox beträgt: " +
            (position.distanceTo([latbox, longbox]) / 1000).toFixed(2) + "Km .Du hast" + punkte + " Punkt(e) in dieser Runde erzielt, deine Gesamtpunktzahl ist " + punkteGesamt).openPopup();
            var pointA = [latbox, longbox];
            var pointList = [pointA, pointB];
            console.log(pointA, pointB);


            firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 5,
                opacity: 0.6,
                smoothFactor: 1
            });
            firstpolyline.addTo(mymap);
            mymap.fitBounds(firstpolyline.getBounds());
        }

    })
    

    //TO-DO
    L.easyButton('glyphicon-ok', function() {
        if (ergebnis == null) {
            ergebnis = L.marker([latbox, longbox], {
                icon: greenIcon
            }).addTo(mymap);

            score();
            ergebnis.bindPopup("Die Entfernung zur Sensebox beträgt: " +
            (position.distanceTo([latbox, longbox]) / 1000).toFixed(2) + "Km .Du hast " + punkte + " Punkt(e) in dieser Runde erzielt, deine Gesamtpunktzahl ist " + punkteGesamt).openPopup();
            var pointA = [latbox, longbox];
            var pointList = [pointA, pointB];
            console.log(pointA, pointB);


            firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 7,
                opacity: 5,
                smoothFactor: 1
            });
            firstpolyline.addTo(mymap);
            mymap.fitBounds(firstpolyline.getBounds());
        } else {
            mymap.removeLayer(ergebnis);
            mymap.removeLayer(firstpolyline);
            ergebnis = L.marker([latbox, longbox], {
                icon: greenIcon
            }).addTo(mymap);
            ergebnis.bindPopup("Die Entfernung zur Sensebox beträgt: " +
            (position.distanceTo([latbox, longbox]) / 1000).toFixed(2) + "Km .Du hast" + punkte + " Punkt(e) in dieser Runde erzielt, deine Gesamtpunktzahl ist " + punkteGesamt).openPopup();
            var pointA = [latbox, longbox];
            var pointList = [pointA, pointB];
            console.log(pointA, pointB);


            firstpolyline = new L.Polyline(pointList, {
                color: 'red',
                weight: 5,
                opacity: 0.6,
                smoothFactor: 1
            });
            firstpolyline.addTo(mymap);
            mymap.fitBounds(firstpolyline.getBounds());
        }

    }).addTo(mymap);

    //TO-DO neue Daten geladen Nachricht  + addieren der Punkte + speichern der Punkte
    L.easyButton('fa-repeat', function() {
        
        
        ZähleRunde()

        mymap.setView([51.4, 9], 5);
        mymap.removeLayer(marker);
        mymap.removeLayer(ergebnis);
        mymap.removeLayer(firstpolyline);
        ergebnis= null;
        randomize(boxId, $http)
        
    }).addTo(mymap);
    mymap.on('click', onMapClick);
    //sucht eine Randombox aus und übergibt das dann der funktion gameBox
    //übergebene boxId
    function randomize(boxId, http) {
        var gameBoxId = boxId[Math.floor(Math.random() * boxId.length)];
        console.log('RandomBoxId: ' + gameBoxId);
        gameBox(gameBoxId, http);
        mymap.removeLayer(marker);
        mymap.removeLayer(ergebnis);
        mymap.removeLayer(firstpolyline);
    };

    function gameBox(gameBoxId, $http) {
        $http({
            method: "GET",
            url: "https://api.opensensemap.org/boxes/" + gameBoxId
        }).then(function mySucces(response) {

            /*if abfrage wenn das datum "kleiner" als 11.11.16 ist dann soll er nochmal eine box
        suchen, oder beim fall eines undefined,
        TO-DO indoor boxen auschließen
        */

            if (response.data.sensors === undefined ||
                response.data.sensors[0].hasOwnProperty("lastMeasurement") == false ||
                response.data.sensors[0].lastMeasurement == null ||
                response.data.sensors[0].lastMeasurement.createdAt <= isoOneHourAgo||
                response.data.sensors[0].lastMeasurement.length <= 3 ||
                response.data.exposure =="indoor"
            ) {
                randomize(boxId, $http);
            } else {
                console.log("sucess");

                //übergebene Koordinaten für clickevent zur Berechnung
                latbox = response.data.loc[0].geometry.coordinates[1];
                longbox = response.data.loc[0].geometry.coordinates[0];
                var sensors = [];

                for (var i = 0; i < response.data.sensors.length; i++) {
                    var sensor = {};
                    sensor.title = response.data.sensors[i].title;
                    sensor.value = response.data.sensors[i].lastMeasurement.value;
                    sensor.unit = response.data.sensors[i].unit;
                    sensor.lastMeasurement = response.data.sensors[i].lastMeasurement.createdAt;
                    sensors.push(sensor);
                }
                $scope.box = sensors;

            }

            function onMapClick(e, latbox, longbox) {

            }

        }, function myError(response) {
            console.log(response);

        });
    }
});