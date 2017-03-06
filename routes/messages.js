'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
  knex('messages')
    .select('id', 'name', 'message')
    .orderBy('id', 'desc')
    .then((results)=>{
      res.json(results);
    })
    .catch((err)=>{
      res.send(err)
    })
});

router.get('/:id', (req,res,next) => {
  knex('messages')
    .select('id', 'name', 'message')
    .where({id: req.params.id})
    .then((results) => {
      res.json(results[0]);
    })
    .catch((err)=>{
      res.send(err)
    })
});

router.post('/', (req,res,next) => {
  knex('messages')
    .insert({
      name: req.body.name,
      message: req.body.message
    }, ['id', 'name', 'message'])
    .then((result) => {
      console.log("RESULT", result[0]);
      res.send(result[0]);
    })
    .catch((err)=>{
      res.send(err)
    })
})

router.patch('/:id', (req,res,next) => {
  knex('messages')
    .update({
      name: req.body.name,
      message: req.body.message
    }, ['id', 'name', 'message'])
    .where({id: req.params.id})
    .then((result) => {
      res.send(result[0]);
    })
    .catch((err)=>{
      res.send(err)
    })
})

router.delete('/:id', (req,res,next) => {
  knex('messages')
    .where('id', req.params.id)
    .del()
    .returning(['id', 'name', 'message'])
    .then((result) => {
      res.send(result[0]);
    })
    .catch((err)=>{
      res.send(err)
    })
})

module.exports = router;
