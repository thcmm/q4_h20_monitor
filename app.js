'use strict';

const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
var reqpromise = require('request-promise');

const messages = require('./routes/messages');
const probedata = require('./routes/probedata');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

app.use('/messages',messages);
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
setInterval(function getAvrValsTimer(){ // set 10 second delay between function calls
    reqpromise('http://10.9.13.51')
        .then(function (avrRestRes) {
            let probeVals = JSON.parse(avrRestRes);
            console.log(probeVals.variables);
            // writeTodB(probeVals);
        })
        .catch(function (err) {
            // Skriv err till fil/db
            // writeErrorToDB(JSON.stringifyh(error))
            console.log('Nada, inget tur gosse');
        });
}, 10000);

// *** MAKES SINGLE INSTERT ***
function writeTodB(probeVals) {
    var insertVars = probeVals.variables;
    // console.log(insertVars);

    db.insert(insertVars).into("probedata").then(function (id) {
        console.log(id);
    })
        .finally(function() {
            // db.destroy();
        });
}
// ***************************************************************************

module.exports = app;
