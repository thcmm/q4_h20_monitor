'use strict';
////////////////////////////
// classifieds.js         //
// Galvanize Classified 2 //
///////////////////////////

/**
KLART - Display all of the ads
KLART - Post a new ad
KLART - Edit existing ads
KLART - Delete an ad
KLART - Display Images
TODO Filter ads (titles and descriptions) restring to only t & d
KLART Sort ads based on posting date and price
**/

const express = require('express');
const router = express.Router();
const knex = require('../knex');

// Visa utvecklare felåtgärdsmeddelanden
var DEBUG = true;
function showDbg() {
    if (DEBUG) {
        console.log.apply(this, arguments);
    }
}

router.get('/', (req, res, next) => {
    console.log('GET /');
    knex.select('id', 'ph', 'ec', 'orp', 'tempuw', 'tempamb', 'humidity', 'altitude', 'created_at').from('probedata')
        .then((probedata) => {
            if (!probedata) {
                res.send("f(GET): Something cataclysmic may be afoot");
                return next();
            }
            res.send(probedata);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:id', (req, res, next) => {
    knex.select('id', 'ph', 'ec', 'orp', 'tempuw', 'tempamb', 'humidity', 'altitude', 'created_at').from('probedata')
        .where('id', req.params.id)
        .first()
        .then((probedata) => {
            if (!probedata) {
                showDbg("f(GET:id): Ush! problem with requested id");
                res.send("f(GET:id): Ush! problem with requested id");
                return next();
            }
            res.send(probedata);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    showDbg("f(POST):id ", req.body.id);
    knex('probedata')
        .insert({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            item_image: req.body.item_image
        }, ['id', 'ph', 'ec', 'orp', 'tempuw', 'tempamb', 'humidity', 'altitude', 'created_at'])
        .then((response) => {
            if (response[0] == undefined) {
                showDbg("**** f(POST): Error with POST request ****");
                res.send("f(POST): Error with POST request");
            } else {
                res.send(response[0]);
            }
        })
        .catch((err) => {
            next(err);
        });
});

// klistra patch har
router.patch('/:id', (req, res, next) => {
    // TODO Lägg till ERROR CHECKING för andra argumenten
    // START: ERROR CHECKING
    const req_id = Number.parseInt(req.params.id);
    // const title = req.body.title;
    // const description = req.body.description;
    // const price = req.body.price;
    // const item_image = req.body.item_image;
    if (Number.isNaN(req_id)) { // ike id överlåta promise
        return next();
    }
    // END: ERROR CHECKING

    // BÖRJA Utveckling meddelanden
    // showDbg("PATCH route:");
    // showDbg("req.params.id:", req_id);
    // showDbg("req.body.title:", req.body.title);
    // showDbg("req.body.description:", req.body.description);
    // showDbg("req.body.price:", req.body.price);
    // showDbg("req.body.item_image:", req.body.item_image);
    // SLUTA Utveckling meddelanden
    knex('probedata')
        .where('id', req_id)
        .update({
            // title: req.body.title,
            // description: req.body.description,
            // price: req.body.price,
            // item_image: req.body.item_image
        }) // Detta maste retur ett object ur valid kolumn
        .returning(['id']) // , 'title', 'description', 'price', 'item_image'
        .then((response) => {
            showDbg("response: ", response[0]);
            if (response[0] == undefined) {
                showDbg("**** Record does not exist ****");
                res.send("f(PATCH): Ush! requested id does not exist");
            } else {
                res.send(response[0]);
            }
        })
        .catch((err) => {
            next(err);
        });
});

// Radera rutt
router.delete('/:id', function(req, res, next) {
    knex.select('id', 'ph', 'ec', 'orp', 'tempuw', 'tempamb', 'humidity', 'altitude', 'created_at').from('probedata')
        .where('id', req.params.id)
        .first()
        .then((probedata) => {
            if (!probedata) {
                return next();
            }
            // res.send(probedata);
            knex('probedata')
                .where({
                    id: req.params.id
                })
                .del()
                .then(function() {
                    // res.sendStatus(200);
                    res.send(probedata)
                })
                .catch(function(err) {
                    next(err);
                });
        })
        .catch((err) => {
            res.send("error");
            next(err);
        });
});

module.exports = router;
