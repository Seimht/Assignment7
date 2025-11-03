/*
  Name: Seim Habte
  Date: 2025-11-02
  CSC 372-01
  pg Pool connection for Neon
*/
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
