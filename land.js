let appData = { locations: [], tripRoutes: [], categories: [] };

function getLocationsByCategory(category) {
  return appData.locations.filter(l => l.category === category);
}

const icons = {
  mapPin: `<img src="icons/pin.svg" style="width: 1rem; height: 1rem;" alt="pin">`,
};

function renderStars(rating) {
  let html = `<div class="stars">`;
  for (let i = 0; i < 5; i++) {
    const cls = i < rating ? 'filled' : 'empty';
    html += `<img src="icons/star_filled.svg" style="width: 1rem; height: 1rem;" alt="pin">` }
  return html + `</div>`;
}

let homeSelectedCategory = null;

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <h2>Categories</h2>
    <nav class="sidebar-nav">
      <button class="sidebar-btn ${homeSelectedCategory === null ? 'active' : ''}" data-category=""> All Destinations </button>
      ${appData.categories.map(cat =>
        `<button class="sidebar-btn ${homeSelectedCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>`).join('')}
    </nav>
  `;
}

function attachHomeListeners() {
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      homeSelectedCategory = btn.dataset.category || null;
      renderSidebar();
      renderHomePage();
      attachHomeListeners();
    });
  });
}

function renderLocationCard(location) {
  const card = document.createElement('div');
  card.className = 'location-card';
  card.innerHTML = `
    <a href="location.html?id=${location.id}" class="card-img-link">
      <img class="card-img" src="${location.image}" alt="${location.name}" loading="lazy"
           onerror="this.src='https://placehold.co/600x400/e2e8f0/64748b?text=Image+not+found'">
    </a>
    <div class="card-body">
      <div class="card-header">
        <a href="location.html?id=${location.id}" class="card-title">${location.name}</a>
        ${renderStars(location.rating)}
      </div>
      <div class="card-category">
        ${icons.mapPin}
        <span>${location.category}</span>
      </div>
      <a href="makeReview.html?id=${location.id}" class="btn-review">Make a Review</a>
    </div>
  `;
  return card;
}

function renderHomePage() {
  const grid = document.getElementById('locations-grid');
  const title = document.getElementById('page-title');
  grid.innerHTML = '';

  const displayed = homeSelectedCategory === null ? appData.locations : getLocationsByCategory(homeSelectedCategory);

  title.textContent = homeSelectedCategory || 'Tara, lakbay.';

  if (displayed.length === 0) {
    grid.innerHTML = '<div class="empty-state">No locations found in this category.</div>';
    return;
  }

  displayed.forEach(location => {
    grid.appendChild(renderLocationCard(location));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      appData = data;
      renderSidebar();
      renderHomePage();
      attachHomeListeners();
    });
});
