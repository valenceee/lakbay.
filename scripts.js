let appData = { locations: [], tripRoutes: [], categories: [] };

async function loadData() {
  const res = await fetch('info.json');
  appData = await res.json();
}

function getLocationById(id) {
  return appData.locations.find(l => l.id === id);
}

function getLocationsByCategory(category) {
  return appData.locations.filter(l => l.category === category);
}

function getRoutesByLocationId(locationId) {
  return appData.tripRoutes.filter(r => r.locationId === locationId);
}
// ============================================================
// icons.js — Inline SVG icons & star renderer
// ============================================================

const icons = {
  compass: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  accessibility: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  navigation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  transport: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"/></svg>`,
};

function renderStars(rating, size = 'sm') {
  let html = `<div class="stars">`;
  for (let i = 0; i < 5; i++) {
    const cls = i < rating ? 'filled' : 'empty';
    html += `<svg class="star ${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${size === 'lg' ? 'width:1.5rem;height:1.5rem' : ''}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return html + `</div>`;
}

// ============================================================
// components.js — Shared components (header, sidebar, card)
// ============================================================

function renderHeader() {
  return `
    <header class="header">
      <div class="header-inner">
        <a href="#/" class="header-brand">
          ${icons.compass}
          <h1>TravelExplorer</h1>
        </a>
      </div>
    </header>`;
}

function renderCategorySidebar(selectedCategory) {
  const allBtn = `<button class="sidebar-btn ${selectedCategory === null ? 'active' : ''}" data-category="">All Destinations</button>`;
  const catBtns = appData.categories.map(cat =>
    `<button class="sidebar-btn ${selectedCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>`
  ).join('');
  return `
    <aside class="sidebar">
      <h2>Categories</h2>
      <nav class="sidebar-nav">
        ${allBtn}
        ${catBtns}
      </nav>
    </aside>`;
}

function renderLocationCard(location) {
  return `
    <div class="location-card">
      <a href="#/location/${location.id}" class="card-img-link">
        <img class="card-img" src="${location.image}" alt="${location.name}" loading="lazy"
             onerror="this.src='https://placehold.co/600x400/e2e8f0/64748b?text=Image+not+found'">
      </a>
      <div class="card-body">
        <div class="card-header">
          <a href="#/location/${location.id}" class="card-title">${location.name}</a>
          ${renderStars(location.rating)}
        </div>
        <div class="card-category">
          ${icons.mapPin}
          <span>${location.category}</span>
        </div>
        <a href="#/location/${location.id}/review" class="btn-review">Make a Review</a>
      </div>
    </div>`;
}

function renderNotFound() {
  return `
    <div class="not-found">
      <p>Location not found.</p>
      <a href="#/">Return to Home</a>
    </div>`;
}

// ============================================================
// page-home.js — Home page (location grid + category filter)
// ============================================================

let homeSelectedCategory = null;

function renderHomePage() {
  const displayed = homeSelectedCategory === null
    ? appData.locations
    : getLocationsByCategory(homeSelectedCategory);

  const cards = displayed.length > 0
    ? displayed.map(renderLocationCard).join('')
    : `<div class="empty-state">No locations found in this category.</div>`;

  return `
    <div class="home-layout">
      ${renderCategorySidebar(homeSelectedCategory)}
      <div class="content-area">
        <div class="content-inner">
          <h1>${homeSelectedCategory || 'Recommended Locations'}</h1>
          <p>Discover amazing destinations around the world</p>
          <div class="locations-grid" id="locations-grid">
            ${cards}
          </div>
        </div>
      </div>
    </div>`;
}

function attachHomeListeners() {
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      homeSelectedCategory = btn.dataset.category || null;
      render();
    });
  });
}

// ============================================================
// page-detail.js — Location detail page
// ============================================================

function renderDetailPage(id) {
  const location = getLocationById(id);
  if (!location) return renderNotFound();

  const tags = location.tags.map(tag => {
    const isPwd  = tag.toLowerCase().includes('pwd');
    const isTime = tag.toLowerCase().includes('am') || tag.toLowerCase().includes('pm');
    const icon   = isPwd ? icons.accessibility : isTime ? icons.clock : '';
    return `<span class="tag">${icon}${tag}</span>`;
  }).join('');

  return `
    <div class="page-wrapper wide">
      <a href="#/" class="back-link">${icons.arrowLeft} Back to Locations</a>
      <div class="detail-card">
        <img class="detail-img" src="${location.image}" alt="${location.name}"
             onerror="this.src='https://placehold.co/1200x400/e2e8f0/64748b?text=Image+not+found'">
        <div class="detail-body">
          <div class="detail-top">
            <div>
              <h1>${location.name}</h1>
              <div class="detail-location">${icons.mapPin}<span>${location.region}</span></div>
            </div>
            ${renderStars(location.rating, 'lg')}
          </div>
          <div class="category-badge">${icons.calendar}${location.category}</div>
          <p class="detail-description">${location.description}</p>
          <div class="detail-tags-title"><h2>Details</h2></div>
          <div class="tags-list">${tags}</div>
          <div class="detail-actions">
            <a href="#/location/${location.id}/plan" class="btn-primary">Plan a Trip</a>
            <a href="#/location/${location.id}/review" class="btn-dark">Write a Review</a>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// page-plan.js — Trip plan page
// ============================================================

function renderPlanPage(id) {
  const location = getLocationById(id);
  if (!location) return renderNotFound();

  const routes = getRoutesByLocationId(id);

  const routeCards = routes.length === 0
    ? `<div class="no-routes">No trip routes available for this location yet.</div>`
    : routes.map(route => `
        <div class="route-card">
          <div class="route-card-header"><h2>${route.name}</h2></div>
          <div class="route-card-body">
            <div class="route-row">
              <span class="route-icon">${icons.mapPin}</span>
              <div><h3>Region</h3><p>${route.region}</p></div>
            </div>
            <div class="route-row">
              <span class="route-icon">${icons.navigation}</span>
              <div><h3>Route</h3><p>${route.route}</p></div>
            </div>
            <div class="route-row">
              <span class="route-icon">${icons.transport}</span>
              <div><h3>Transportation</h3><p>${route.transportation}</p></div>
            </div>
            <div class="route-row">
              <span class="route-icon">${icons.cloud}</span>
              <div><h3>Best Weather Conditions</h3><p>${route.bestWeather}</p></div>
            </div>
            <div class="route-row">
              <span class="route-icon">${icons.clock}</span>
              <div><h3>Best Time Recommendation</h3><p>${route.bestTime}</p></div>
            </div>
          </div>
        </div>`).join('');

  return `
    <div class="page-wrapper wide">
      <a href="#/location/${id}" class="back-link">${icons.arrowLeft} Back to ${location.name}</a>
      <div class="plan-header">
        <h1>Plan Your Trip</h1>
        <p>Recommended routes and travel information for ${location.name}</p>
      </div>
      <div class="routes-list">${routeCards}</div>
      <div class="plan-footer">
        <a href="#/location/${id}" class="btn-dark" style="display:inline-block">Back to Location Details</a>
      </div>
    </div>`;
}

// ============================================================
// page-review.js — Review form page
// ============================================================

let reviewState = {
  locationId: null,
  overallRating: 0,
  hoveredRating: 0,
  submitted: false,
  fields: {
    crAvailability: '', crCleanliness: '', signageVisibility: '', informationClarity: '',
    staffFriendliness: '', staffKnowledge: '', accessibilityRating: '', parkingAvailability: '',
    safetyRating: '', cleanlinessRating: '', facilitiesRating: '', valueForMoney: '',
    metExpectations: '', crowdLevel: '', waitTime: '', photoOpportunities: '',
    foodQuality: '', amenitiesQuality: '', wouldRecommend: '', wouldReturn: '',
    additionalComments: '',
  }
};

function renderReviewPage(id) {
  const location = getLocationById(id);
  if (!location) return renderNotFound();

  // Reset state if switching to a different location
  if (reviewState.locationId !== id) {
    reviewState = {
      locationId: id,
      overallRating: 0,
      hoveredRating: 0,
      submitted: false,
      fields: Object.fromEntries(Object.keys(reviewState.fields).map(k => [k, '']))
    };
  }

  if (reviewState.submitted) {
    return `
      <div class="page-wrapper">
        <div class="success-card">
          <div class="success-icon">✓</div>
          <h1>Thank You!</h1>
          <p>Your review for ${location.name} has been submitted successfully.</p>
          <p class="redirect">Redirecting you back...</p>
        </div>
      </div>`;
  }

  function select(name, options, required = true) {
    const req = required ? 'required' : '';
    const opts = options.map(([val, label]) =>
      `<option value="${val}" ${reviewState.fields[name] === val ? 'selected' : ''}>${label}</option>`
    ).join('');
    return `
      <select name="${name}" ${req} data-review-field="${name}">
        <option value="">Select...</option>
        ${opts}
      </select>`;
  }

  const starBtns = [1, 2, 3, 4, 5].map(n => {
    const active = n <= (reviewState.hoveredRating || reviewState.overallRating);
    return `
      <button type="button" class="star-btn" data-star="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">
        <svg class="${active ? 'filled' : 'empty'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>`;
  }).join('');

  return `
    <div class="page-wrapper">
      <a href="#/location/${id}" class="back-link">${icons.arrowLeft} Back to ${location.name}</a>
      <div class="review-card">
        <h1>Write a Review</h1>
        <p>Share your experience at ${location.name}</p>
        <form id="review-form" novalidate>

          <div class="form-section">
            <label>Overall Rating</label>
            <div class="star-rating" id="star-rating">${starBtns}</div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Facilities &amp; Amenities</div>
            <div class="form-group"><label>Restroom (CR) Availability</label>
              ${select('crAvailability', [['easily-accessible','Easily Accessible'],['available-but-limited','Available but Limited'],['difficult-to-find','Difficult to Find'],['not-available','Not Available']])}
            </div>
            <div class="form-group"><label>Restroom Cleanliness</label>
              ${select('crCleanliness', [['very-clean','Very Clean'],['clean','Clean'],['acceptable','Acceptable'],['needs-improvement','Needs Improvement'],['poor','Poor']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Signage &amp; Information</div>
            <div class="form-group"><label>Were signs visible and easy to follow?</label>
              ${select('signageVisibility', [['excellent','Excellent - Very clear and visible'],['good','Good - Mostly clear'],['fair','Fair - Some signs were unclear'],['poor','Poor - Difficult to navigate']])}
            </div>
            <div class="form-group"><label>Was information clear and helpful?</label>
              ${select('informationClarity', [['very-helpful','Very Helpful'],['helpful','Helpful'],['somewhat-helpful','Somewhat Helpful'],['not-helpful','Not Helpful']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Staff &amp; Service</div>
            <div class="form-group"><label>Staff Friendliness</label>
              ${select('staffFriendliness', [['very-friendly','Very Friendly'],['friendly','Friendly'],['neutral','Neutral'],['unfriendly','Unfriendly'],['no-interaction','No Interaction']])}
            </div>
            <div class="form-group"><label>Staff Knowledge</label>
              ${select('staffKnowledge', [['very-knowledgeable','Very Knowledgeable'],['knowledgeable','Knowledgeable'],['somewhat-knowledgeable','Somewhat Knowledgeable'],['not-knowledgeable','Not Knowledgeable']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Accessibility &amp; Convenience</div>
            <div class="form-group"><label>Accessibility for PWD (Persons with Disabilities)</label>
              ${select('accessibilityRating', [['fully-accessible','Fully Accessible'],['mostly-accessible','Mostly Accessible'],['partially-accessible','Partially Accessible'],['not-accessible','Not Accessible'],['not-applicable','Not Applicable']])}
            </div>
            <div class="form-group"><label>Parking Availability</label>
              ${select('parkingAvailability', [['ample-parking','Ample Parking'],['adequate-parking','Adequate Parking'],['limited-parking','Limited Parking'],['no-parking','No Parking'],['not-applicable','Not Applicable']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Overall Experience</div>
            <div class="form-group"><label>Safety Rating</label>
              ${select('safetyRating', [['very-safe','Very Safe'],['safe','Safe'],['somewhat-safe','Somewhat Safe'],['unsafe','Unsafe']])}
            </div>
            <div class="form-group"><label>Cleanliness Rating</label>
              ${select('cleanlinessRating', [['very-clean','Very Clean'],['clean','Clean'],['acceptable','Acceptable'],['needs-improvement','Needs Improvement']])}
            </div>
            <div class="form-group"><label>Quality of Facilities</label>
              ${select('facilitiesRating', [['excellent','Excellent'],['good','Good'],['fair','Fair'],['poor','Poor']])}
            </div>
            <div class="form-group"><label>Value for Money</label>
              ${select('valueForMoney', [['excellent-value','Excellent Value'],['good-value','Good Value'],['fair-value','Fair Value'],['poor-value','Poor Value'],['free-entry','Free Entry']])}
            </div>
            <div class="form-group"><label>Did it meet your expectations?</label>
              ${select('metExpectations', [['exceeded','Exceeded Expectations'],['met','Met Expectations'],['somewhat-met','Somewhat Met Expectations'],['did-not-meet','Did Not Meet Expectations']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Visit Details</div>
            <div class="form-group"><label>Crowd Level</label>
              ${select('crowdLevel', [['very-crowded','Very Crowded'],['crowded','Crowded'],['moderate','Moderate'],['light','Light Crowd'],['empty','Nearly Empty']])}
            </div>
            <div class="form-group"><label>Wait Time</label>
              ${select('waitTime', [['no-wait','No Wait'],['under-15min','Under 15 minutes'],['15-30min','15-30 minutes'],['30-60min','30-60 minutes'],['over-60min','Over 60 minutes']])}
            </div>
            <div class="form-group"><label>Photo Opportunities</label>
              ${select('photoOpportunities', [['excellent','Excellent'],['good','Good'],['fair','Fair'],['limited','Limited']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Food &amp; Additional Amenities</div>
            <div class="form-group"><label>Food Quality (if applicable)</label>
              ${select('foodQuality', [['excellent','Excellent'],['good','Good'],['fair','Fair'],['poor','Poor'],['not-applicable','Not Applicable']], false)}
            </div>
            <div class="form-group"><label>Quality of Other Amenities</label>
              ${select('amenitiesQuality', [['excellent','Excellent'],['good','Good'],['fair','Fair'],['poor','Poor'],['not-applicable','Not Applicable']])}
            </div>
          </div>

          <div class="form-section">
            <div class="form-section-title">Final Thoughts</div>
            <div class="form-group"><label>Would you recommend this to others?</label>
              ${select('wouldRecommend', [['definitely','Definitely'],['probably','Probably'],['maybe','Maybe'],['probably-not','Probably Not'],['definitely-not','Definitely Not']])}
            </div>
            <div class="form-group"><label>Would you return?</label>
              ${select('wouldReturn', [['yes-definitely','Yes, Definitely'],['yes-maybe','Yes, Maybe'],['unsure','Unsure'],['probably-not','Probably Not'],['no','No']])}
            </div>
          </div>

          <div class="form-group">
            <label>Additional Comments</label>
            <textarea name="additionalComments" rows="6" placeholder="Tell us more about your experience..."
                      data-review-field="additionalComments">${reviewState.fields.additionalComments}</textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">Submit Review</button>
            <a href="#/location/${id}" class="btn-cancel">Cancel</a>
          </div>
        </form>
      </div>
    </div>`;
}

function attachReviewListeners(id) {
  const starContainer = document.getElementById('star-rating');
  if (starContainer) {
    starContainer.addEventListener('mouseleave', () => {
      reviewState.hoveredRating = 0;
      updateStarDisplay();
    });
    starContainer.querySelectorAll('.star-btn').forEach(btn => {
      const n = parseInt(btn.dataset.star);
      btn.addEventListener('mouseenter', () => {
        reviewState.hoveredRating = n;
        updateStarDisplay();
      });
      btn.addEventListener('click', () => {
        reviewState.overallRating = n;
        updateStarDisplay();
      });
    });
  }

  document.querySelectorAll('[data-review-field]').forEach(el => {
    el.addEventListener('change', () => { reviewState.fields[el.dataset.reviewField] = el.value; });
    el.addEventListener('input',  () => { reviewState.fields[el.dataset.reviewField] = el.value; });
  });

  const form = document.getElementById('review-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      reviewState.submitted = true;
      render();
      setTimeout(() => {
        reviewState = { locationId: null, overallRating: 0, hoveredRating: 0, submitted: false, fields: {} };
        navigate(`/location/${id}`);
      }, 2000);
    });
  }
}

function updateStarDisplay() {
  const starContainer = document.getElementById('star-rating');
  if (!starContainer) return;
  starContainer.querySelectorAll('.star-btn').forEach(btn => {
    const n = parseInt(btn.dataset.star);
    const active = n <= (reviewState.hoveredRating || reviewState.overallRating);
    const svg = btn.querySelector('svg');
    if (svg) svg.className = active ? 'filled' : 'empty';
  });
}

// ============================================================
// router.js — Hash-based routing
// ============================================================

let currentRoute = null;

function parseRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  if (hash === '/') return { name: 'home', params: {} };

  const planMatch = hash.match(/^\/location\/([^/]+)\/plan$/);
  if (planMatch) return { name: 'plan', params: { id: planMatch[1] } };

  const reviewMatch = hash.match(/^\/location\/([^/]+)\/review$/);
  if (reviewMatch) return { name: 'review', params: { id: reviewMatch[1] } };

  const detailMatch = hash.match(/^\/location\/([^/]+)$/);
  if (detailMatch) return { name: 'detail', params: { id: detailMatch[1] } };

  return { name: 'home', params: {} };
}

function navigate(path) {
  window.location.hash = path;
}

function handleRouteChange() {
  currentRoute = parseRoute();
  render();
}

// ============================================================
// main.js — Render engine & app initialisation
// ============================================================

function render() {
  const route = currentRoute || parseRoute();
  let pageHTML = '';

  if      (route.name === 'home')   pageHTML = renderHomePage();
  else if (route.name === 'detail') pageHTML = renderDetailPage(route.params.id);
  else if (route.name === 'plan')   pageHTML = renderPlanPage(route.params.id);
  else if (route.name === 'review') pageHTML = renderReviewPage(route.params.id);
  else                              pageHTML = renderNotFound();

  document.getElementById('app').innerHTML = renderHeader() + `<main>${pageHTML}</main>`;
  attachEventListeners(route);
  window.scrollTo(0, 0);
}

function attachEventListeners(route) {
  if (route.name === 'home')   attachHomeListeners();
  if (route.name === 'review') attachReviewListeners(route.params.id);
}

// ── Bootstrap ──
window.addEventListener('hashchange', handleRouteChange);

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  handleRouteChange();
});