/*
  Name: Seim Habte
  Date: 2025-11-02
  CSC 372-01
  Data access layer
*/
const pool = require('../db/pool');

async function getCategories() {
  const { rows } = await pool.query('SELECT name FROM categories ORDER BY name');
  return rows.map(r => r.name);
}
async function getCategoryIdByName(category) {
  const { rows } = await pool.query('SELECT id FROM categories WHERE name = LOWER($1)', [category]);
  return rows[0]?.id ?? null;
}
async function getJokesByCategory(category, limit) {
  const id = await getCategoryIdByName(category);
  if (!id) return null;
  const params = [id];
  let sql = 'SELECT setup, delivery FROM jokes WHERE category_id = $1 ORDER BY id';
  if (limit) { sql += ' LIMIT $2'; params.push(Number(limit)); }
  const { rows } = await pool.query(sql, params);
  return rows;
}
async function getRandomJoke() {
  const { rows } = await pool.query('SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1');
  return rows[0] ?? null;
}
async function addJoke(category, setup, delivery) {
  const { rows: catRows } = await pool.query('SELECT upsert_category_lower($1) AS id', [category]);
  const categoryId = catRows[0].id;
  await pool.query('INSERT INTO jokes(category_id, setup, delivery) VALUES ($1,$2,$3)', [categoryId, setup, delivery]);
  const { rows } = await pool.query('SELECT setup, delivery FROM jokes WHERE category_id = $1 ORDER BY id', [categoryId]);
  return rows;
}

module.exports = { getCategories, getJokesByCategory, getRandomJoke, addJoke };
