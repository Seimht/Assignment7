/*
  Name: Seim Habte
  Date: 2025-11-02
  CSC 372-01
  Router
*/
const express = require('express');
const r = express.Router();
const c = require('../controllers/jokebook-controller');

r.get('/categories', c.listCategories);
r.get('/category/:category', c.listCategoryJokes);
r.get('/random', c.randomJoke);
r.post('/joke/add', c.addJoke);

module.exports = r;
