/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var sw = false;
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        if(sw){
            sendMyLocation();
        }
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        cordova.plugin.http.setHeader('Content-Type', 'application/json');
        cordova.plugin.http.setHeader('Access-Control-Allow-Origin', '*');
        cordova.plugin.http.setDataSerializer('json');
        var timer = new window.nativeTimer();
        timer.onTick = function(tick) {
            console.log("tick");
            $('.app').empty();
            scan("sajad");

        };
        timer.onError = function(errorMessage) {
            // invoked after error occurs
        };
        timer.start(
            5000,
            5000,
            function() {
                scan("sajad");
            },
            function(errorMessage) {
                // invoked after unsuccessful start
            });
    }

};


function scan(username) {
    var wifiManager = window.cordova.plugins.WifiManager;
    wifiManager.getScanResults(function (err, scanResults) {
        var data = [];
        if(err){
            console.log(err)
        }
        else {
            scanResults.forEach(function (t) {
                data.push({
                    ssid : t.BSSID,
                    level: t.level
                });
            });
            getMyLocation(username)
        }
    });
}

function sendMyLocation(err, data, callback){
    if(err)
        console.log(err);
    else{
        var dataToSend = {
            d: "sajad",
            f: "ferdowsi_uni_eng",
            s: {
                bluetooth:{},
                wifi:{}
            }
        };
        data.forEach(function (t) {
            dataToSend.s.wifi[t.ssid] = t.level.toString();
        });
        console.log(JSON.stringify(dataToSend));
        var options = {
            method: 'POST',
            data: dataToSend
        };

        cordova.plugin.http.sendRequest('http://165.227.182.223:8005/data', options, function(response) {
            // prints 200
            console.log(response.data);
            console.log(response.status);
        }, function(response) {
            // prints 403
            console.log(response.status);

            //prints Permission denied
            console.log(response.error)
        });
    }
}

function getPath(location) {
    var options = {
        method: 'GET'
    };
    var source;
    if(location === "b305"){
        source = 2;
    }
    else if(location === "b308"){
        source = 3;
    }
    else if(location === "b311"){
        source = 4;
    }
    else {
        source = 0;
    }


    if(source === 1){
        $(".app").append("<img src=\"img/runner.png\" style=\"height: 30px; width: 30px; position: fixed; top: 10%; left: 45%; z-index: 1\">")
    }
    else if(source === 2){
        $(".app").append("<img src=\"img/runner.png\" style=\"height: 30px; width: 30px; position: fixed; top: 25%; left: 45%; z-index: 1\">")
    }
    else if(source === 3){
        $(".app").append("<img src=\"img/runner.png\" style=\"height: 30px; width: 30px; position: fixed; top: 40%; left: 45%; z-index: 1\">")
    }
    else if(source === 4){
        $(".app").append("<img src=\"img/runner.png\" style=\"height: 30px; width: 30px; position: fixed; top: 70%; left: 45%; z-index: 1\">")
    }

    console.log(source+ " " + location);
    cordova.plugin.http.sendRequest('http://192.168.1.34:8000/path?source=' + source, options, function(response) {
        // prints 200
        var path = JSON.parse(response.data).path;
        var fire = JSON.parse(response.data).fire;
        fire.forEach(function (t) {
           if(t == "1,2"){
               $(".app").append("<img src=\"img/fire.png\" style=\"height: 100px; width: 100px; position: fixed; top: 5%; left: 36%;  z-index: 1\">")
           }
           else if(t == "2,3"){
               $(".app").append("<img src=\"img/fire.png\" style=\"height: 100px; width: 100px; position: fixed; top: 30%; left: 36%;  z-index: 1\">")
           }
           else if(t == "3,4"){
               $(".app").append("<img src=\"img/fire.png\" style=\"height: 100px; width: 100px; position: fixed; top: 55%; left: 36%;  z-index: 1\">")
           }
           else if(t == "4,5"){
               $(".app").append("<img src=\"img/fire.png\" style=\"height: 100px; width: 100px; position: fixed; top: 80%; left: 36%;  z-index: 1\">")
           }
        });
        if(path[path.length-1] == 5) {
            $(".app").append("<img src=\"img/location.png\" style=\"height: 50px; width: 50px; position: fixed; top: 85%; left: 42%;  z-index: 1\">" +
                "<img src=\"img/down.png\" style=\"width: 100px; height: 10%; position: fixed; top: 75%; left: 36%\">");
            if(path[0] == 2){
                $(".app").append("<div style=\"background-color: green; min-width: 50px; height: 45%; position: fixed; top: 30%; border-radius: 5px; left: 43%\"></div>")
            }
            else if(path[0] == 3){
                $(".app").append("<div style=\"background-color: green; min-width: 50px; height: 30%; position: fixed; top: 45%; border-radius: 5px; left: 43%\"></div>")
            }
        }
        else if(path[path.length-1] == 1){
            $(".app").append("<img src=\"img/location.png\" style=\"height: 50px; width: 50px; position: fixed; top: 5%; left: 42%;  z-index: 1\">" +
                "<img src=\"img/up.png\" style=\"width: 100px; height: 10%; position: fixed; top: 12%; left: 36%\">");

            if(path[0] == 3){
                $(".app").append("<div style=\"background-color: green; min-width: 50px; height: 25%; position: fixed; top: 22%; border-radius: 5px; left: 43%\"></div>")
            }
            else if(path[0] == 4){
                $(".app").append("<div style=\"background-color: green; min-width: 50px; height: 45%; position: fixed; top: 22%; border-radius: 5px; left: 43%\"></div>")
            }
        }
        console.log(response.data);
        console.log(response.status)
    }, function(response) {
        // prints 403
        console.log(response.status);

        //prints Permission denied
        console.log(response.error);
        navigator.notification.alert(JSON.parse(response.error).message, function () {}, "You will die very soon!");
        $('.app').html("<img src=\"img/ezraeel.jpg\" style='height: 100%; width: 100%; z-index: 100'>")
        var my_media = new Media('http://192.168.1.34/Ablis.mp3',
            // success callback
            function () {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + JSON.stringify(err));
            }
        );
        // Play audio
        my_media.play();
    });
}


function getMyLocation(username){
    var options = {
        method: 'GET'
    };

    cordova.plugin.http.sendRequest('https://cloud.internalpositioning.com/api/v1/location/ferdowsi_uni_eng/'+username, options, function(response) {
        var max = {
            name: "",
            prob: 0
        };
        JSON.parse(response.data).analysis.guesses.forEach(function (t) {
            if(t.probability >= max.prob){
                max.name = t.location;
                max.prob = t.probability;
            }
        });

        getPath(max.name);
    }, function(response) {
        // prints 403
        console.log(response.status);

        //prints Permission denied
        console.log(response.error);
    });
}
app.initialize();