'use strict';

const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
var db  = require('./knexdb');
const request = require('request');
var reqpromise = require('request-promise');

// Route var
const probedata = require('./routes/probedata');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

// Route
app.use('/probedata', probedata);

app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
})

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// ***************************************************************************
setInterval(function getAvrValsTimer(){ // 10 sekunders fördröjning mellan funktionsanrop
    reqpromise('http://10.9.13.51') // http://localhost:9000/probedata *** Måste uppdatera beroende på wifi-anslutning ***
        .then(function (avrRestRes) {
            let probeVals = JSON.parse(avrRestRes);
            console.log('db: ', db);
            console.log("vals from node: ", probeVals.variables);
            writeTodB(probeVals);
        })
        .catch(function (err) {
            // Skriv err till fil/db
            // writeErrorToDB(JSON.stringifyh(error))
            console.log('Nada, inget tur gosse! *** Kontrollera wifi-anslutning ***');
        });
}, 10000);

// *** MAKES SINGLE INSTERT ***
function writeTodB(probeVals) {
    var insertVars = probeVals.variables;
    console.log('insertVars: ', insertVars);
    db.insert(insertVars).into("probedata").then(function (id) {console.log("insertVars",id);
    })
        .finally(function() {
            // db.destroy();
        });
}
// ***************************************************************************

module.exports = app;
