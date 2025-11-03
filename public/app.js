/*
  Name: Seim Habte
  Date: 2025-11-02
  CSC 372-01
  Frontend logic
*/
async function getJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function renderJoke(container, { setup, delivery }) {
  const wrap = document.createElement('div');
  wrap.className = 'joke';
  const p1 = document.createElement('p'); p1.textContent = setup;
  const p2 = document.createElement('p'); p2.textContent = delivery;
  wrap.appendChild(p1); wrap.appendChild(p2);
  container.appendChild(wrap);
}


async function loadRandom() {
  const data = await getJSON('/jokebook/random');
  const box = document.getElementById('random-joke');
  box.textContent = '';
  data && data.setup ? renderJoke(box, data) : box.textContent = 'no jokes yet.';
}


async function loadCategories() {
  const data = await getJSON('/jokebook/categories');
  const ul = document.getElementById('category-list');
  if (!ul) return;
  ul.textContent = '';

  data.categories.forEach(cat => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = cat;
    btn.addEventListener('click', () => showCategory(cat));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}


let currentCategory = null;

function renderCategoryJokes(cat, jokes) {
  const view = document.getElementById('category-view');
  const name = document.getElementById('category-name');
  const box  = document.getElementById('category-jokes');
  if (!view || !name || !box) return;

  name.textContent = cat;
  box.textContent = '';

  if (!jokes || jokes.length === 0) {
    box.textContent = '(no jokes yet)';
  } else {
    jokes.forEach(j => renderJoke(box, j));
  }
  view.hidden = false;
}

async function loadCategory(cat) {
  const limitSel = document.getElementById('cat-limit');
  const limit = limitSel && limitSel.value ? `?limit=${encodeURIComponent(limitSel.value)}` : '';
  const data = await getJSON(`/jokebook/category/${encodeURIComponent(cat)}${limit}`);
  return data.jokes;
}

async function showCategory(cat) {
  currentCategory = cat;
  const jokes = await loadCategory(cat);
  renderCategoryJokes(cat, jokes);
}

async function handleAdd(e) {
  e.preventDefault();
  const category = document.getElementById('add-category').value.trim().toLowerCase();
  const setup    = document.getElementById('add-setup').value.trim();
  const delivery = document.getElementById('add-delivery').value.trim();

  const data = await getJSON('/jokebook/joke/add', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ category, setup, delivery })
  });


  currentCategory = data.category;
  renderCategoryJokes(data.category, data.jokes);

  document.getElementById('add-form').reset();
}


const btnRandom = document.getElementById('refresh-random');
if (btnRandom) btnRandom.addEventListener('click', loadRandom);

const btnLoadCats = document.getElementById('load-categories');
if (btnLoadCats) btnLoadCats.addEventListener('click', loadCategories);

const addForm = document.getElementById('add-form');
if (addForm) addForm.addEventListener('submit', handleAdd);

const searchForm = document.getElementById('category-search');
if (searchForm) {
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('search-input');
    const cat = (input?.value || '').trim().toLowerCase();
    if (cat) await showCategory(cat);
  });
}

const reloadBtn = document.getElementById('reload-category');
if (reloadBtn) reloadBtn.addEventListener('click', () => {
  if (currentCategory) showCategory(currentCategory);
});


loadRandom();
