function renderStars(rating) {
  let html = '';
  for (let i = 0; i < 5; i++) {
    const cls = i < rating ? 'filled' : 'empty';
    html += `<svg class="star ${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.5rem;height:1.5rem"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html;
}

function renderLocationDetail(location) {

  const img = document.getElementById('detail-img');
  img.src = location.image;
  img.alt = location.name;

  document.getElementById('detail-name').textContent    = location.name;
  document.getElementById('detail-region').textContent  = location.region;
  document.getElementById('detail-stars').innerHTML = renderStars(location.rating);
  document.getElementById('detail-badge').textContent = location.category;
  document.getElementById('detail-description').textContent = location.description;

  const tagsList = document.getElementById('detail-tags');
  location.tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsList.appendChild(span);
  });

  document.getElementById('btn-plan').href   = `plan.html?id=${location.id}`;
  document.getElementById('btn-review').href = `makeReview.html?id=${location.id}`;

  document.title = `lakbay. - ${location.name}`;
}

// if image not found
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
      renderLocationDetail(location);
    });
});
