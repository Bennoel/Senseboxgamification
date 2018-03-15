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
        if (((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) < 50) {
            punkte = punkte + +20;
            punkteGesamt = + punkteGesamt + +20;
        }
        if (((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) < 150 && ((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) > 50) {
            punkte += punkte + +10;
            punkteGesamt = + punkteGesamt + +10;
        }
        if (((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) < 250 && ((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) > 150) {
            punkte += punkte + +5;
            punkteGesamt = + punkteGesamt + +5;
        }
        if (((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) > 250 && ((position.distanceTo([latbox, longbox]) / 1000).toFixed(2)) < 400) {
            punkte = punkte+ +1;
            punkteGesamt = + punkteGesamt + +1;
        }
    };




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
    
    $("#NeueRundebtn").click(function(){

        mymap.setView([51.4, 9], 4);
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

    }).addTo(mymap);

    //TO-DO neue Daten geladen Nachricht  + addieren der Punkte + speichern der Punkte
    L.easyButton('fa-repeat', function() {

        mymap.setView([51.4, 9], 4);
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