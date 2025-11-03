/*
  Name:Seim Habte
  Date: 2025-11-02
  CSC 372-01
  Express server for Jokebook (Neon)
*/
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/jokebook-routes');
app.use('/jokebook', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
