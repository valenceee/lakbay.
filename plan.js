// ── Build one route card ──
function renderRouteCard(route) {
  const card = document.createElement('div');
  card.className = 'route-card';

  card.innerHTML = `
    <div class="route-card-header">
      <h2>${route.name}</h2>
    </div>
    <div class="route-card-body">

      <div class="route-row">
        <img src="icons/map.svg" class="input-icon" style="width: 1.3rem; height: 1.3rem;">
        <div>
          <h3>Region</h3>
          <p>${route.region}</p>
        </div>
      </div>

      <div class="route-row">
        <img src="icons/navigate.svg" class="input-icon" style="width: 1.3rem; height: 1.3rem;">
        <div>
          <h3>Route</h3>
          <p>${route.route}</p>
        </div>
      </div>

      <div class="route-row">
        <img src="icons/road.svg" class="input-icon" style="width: 1.3rem; height: 1.3rem;">
        <div>
          <h3>Transportation</h3>
          <p>${route.transportation}</p>
        </div>
      </div>

      <div class="route-row">
        <img src="icons/sun.svg" class="input-icon" style="width: 1.3rem; height: 1.3rem;">
        <div>
          <h3>Best Weather Conditions</h3>
          <p>${route.bestWeather}</p>
        </div>
      </div>

      <div class="route-row">
        <img src="icons/time.svg" class="input-icon" style="width: 1.3rem; height: 1.3rem;">
        <div>
          <h3>Best Time Recommendation</h3>
          <p>${route.bestTime}</p>
        </div>
      </div>

    </div>
  `;

  return card;
}

function renderNotFound() {
  document.getElementById('app').innerHTML = `
    <div class="not-found">
      <p>Location not found.</p>
      <a href="land.html">Return to Home</a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    window.location.href = 'land.html';
    return;
  }

  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const location = data.locations.find(l => l.id === id);

      if (!location) {
        renderNotFound();
        return;
      }

      // update back link and footer button
      document.getElementById('back-link').href = `location.html?id=${id}`;
      document.getElementById('btn-back').href  = `location.html?id=${id}`;

      // update header text
      document.getElementById('plan-title').textContent    = `Plan Your Trip`;
      document.getElementById('plan-subtitle').textContent = `Recommended routes and travel information for ${location.name}`;
      document.title = `Plan a Trip - ${location.name} | lakbay.`;

      // find and render routes
      const routes = data.tripRoutes.filter(r => r.locationId === id);
      const routesList = document.getElementById('routes-list');

      if (routes.length === 0) {
        document.getElementById('no-routes').classList.remove('hidden');
        return;
      }

      routes.forEach(route => {
        routesList.appendChild(renderRouteCard(route));
      });
    });
});
