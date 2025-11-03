/*
  Name: Seim Habte
  Date: 2025-11-02
  CSC 372-01
  Route handlers
*/
const model = require('../models/joke-model');

async function listCategories(req, res) {
  const categories = await model.getCategories();
  res.json({ categories });
}
async function listCategoryJokes(req, res) {
  const { category } = req.params;
  const { limit } = req.query;
  const jokes = await model.getJokesByCategory(category, limit);
  if (!jokes) return res.status(400).json({ error: `Unknown category: ${category}` });
  res.json({ category: category.toLowerCase(), jokes });
}
async function randomJoke(req, res) {
  const joke = await model.getRandomJoke();
  res.json(joke ?? { message: 'No jokes yet.' });
}
async function addJoke(req, res) {
  const { category, setup, delivery } = req.body;
  if (!category || !setup || !delivery) return res.status(400).json({ error: 'category, setup, delivery required' });
  const updated = await model.addJoke(category, setup, delivery);
  res.status(201).json({ category: category.toLowerCase(), jokes: updated });
}
module.exports = { listCategories, listCategoryJokes, randomJoke, addJoke };
