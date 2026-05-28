// sample survey data ito,,,
const surveyData = [
{ date: '2026-05-20', location: 'Enchanted Kingdon', rating: 5, safety: 'very-safe',  cleanliness: 'very-clean',  accessibility: 'fully-accessible',    wouldRecommend: 'definitely',  comments: 'Ganda' },
{ date: '2026-05-20', location: 'Enchanted Kingdon', rating: 5, safety: 'very-safe',  cleanliness: 'very-clean',  accessibility: 'fully-accessible',    wouldRecommend: 'definitely',  comments: 'Ganda' },
{ date: '2026-05-20', location: 'Enchanted Kingdon', rating: 5, safety: 'very-safe',  cleanliness: 'very-clean',  accessibility: 'fully-accessible',    wouldRecommend: 'definitely',  comments: 'Ganda' },
];

const PIE_COLORS = ['#0f172a','#0ea5e9', '#324063', '#7dd3fc','#bae6fd','#94a3b8'];

function starsSVG(rating, size = '1rem') {
let h = '<div class="stars-row">';
for (let i = 0; i < 5; i++) {
    const filled = i < rating;
    h += `<svg viewBox="0 0 24 24" style="width:${size};height:${size};fill:${filled ? '#f59e0b' : '#e2e8f0'};stroke:none;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
}
return h + '</div>';
}

function badgeClass(val) {
if (!val) return 'badge-gray';
const v = val.toLowerCase();
if (v.includes('very-safe') || v.includes('very-clean') || v.includes('fully') || v === 'definitely') return 'badge-green';
if (v.includes('safe') || v.includes('clean') || v.includes('mostly')) return 'badge-blue';
if (v.includes('partial') || v.includes('acceptable')) return 'badge-yellow';
if (v.includes('not') || v.includes('poor')) return 'badge-gray';
return 'badge-purple';
}

function fmtDate(d) {
return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function drawPie(canvas, segments) {
const ctx = canvas.getContext('2d');
const cx = canvas.width / 2, cy = canvas.height / 2, r = 75;
let start = -Math.PI / 2;
ctx.clearRect(0, 0, canvas.width, canvas.height);
segments.forEach((seg, i) => {
    const angle = (seg.pct / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = PIE_COLORS[i % PIE_COLORS.length];
    ctx.fill();
    start += angle;
});
}

function drawBar(container, data) {
container.innerHTML = '';
const max = Math.max(...data.map(d => d.count), 1);
data.forEach(d => {
    const h = Math.round((d.count / max) * 160);
    const g = document.createElement('div');
    g.className = 'bar-group';
    g.innerHTML = `
    <span class="bar-value">${d.count}</span>
    <div class="bar" style="height:${h}px;" title="${d.label}: ${d.count}"></div>
    <span class="bar-label">${d.label}</span>
    `;
    container.appendChild(g);
});
}

// main initialization
document.addEventListener('DOMContentLoaded', () => {
fetch('data.json')
    .then(r => r.json())
    .then(data => {
    const { locations, categories } = data;

    // stats
    document.getElementById('stat-locations').childNodes[0].textContent = locations.length;
    document.getElementById('stat-responses').textContent = surveyData.length;
    document.getElementById('stat-categories').textContent = categories.length;
    const avgRating = (surveyData.reduce((s, r) => s + r.rating, 0) / surveyData.length).toFixed(1);
    document.getElementById('stat-avg-rating').childNodes[0].textContent = avgRating + ' ';

    // pie
    const catCounts = {};
    categories.forEach(c => catCounts[c] = 0);
    locations.forEach(l => { if (catCounts[l.category] !== undefined) catCounts[l.category]++; });
    const total = locations.length;
    const segments = categories.map((c, i) => ({
        label: c, count: catCounts[c],
        pct: Math.round((catCounts[c] / total) * 100),
        color: PIE_COLORS[i % PIE_COLORS.length]
    }));
    drawPie(document.getElementById('pie-chart'), segments);
    const legend = document.getElementById('pie-legend');
    segments.forEach(s => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `<span class="legend-dot" style="background:${s.color}"></span><span>${s.label}: ${s.pct}%</span>`;
        legend.appendChild(item);
    });

    // bar
    const ratingCounts = [1,2,3,4,5].map(n => ({
        label: n + (n === 1 ? ' Star' : ' Stars'),
        count: locations.filter(l => l.rating === n).length
    }));
    drawBar(document.getElementById('bar-chart'), ratingCounts);

    // dropdowns
    const catSel = document.getElementById('loc-category');
    categories.forEach(c => {
        const o = document.createElement('option');
        o.value = c; o.textContent = c;
        catSel.appendChild(o);
    });

    const regions = [...new Set(locations.map(l => l.region.split(',')[1]?.trim() || l.region))];
    const regSel = document.getElementById('loc-region');
    regions.sort().forEach(r => {
        const o = document.createElement('option');
        o.value = r; o.textContent = r;
        regSel.appendChild(o);
    });

    const srvLocSel = document.getElementById('srv-location');
    [...new Set(surveyData.map(s => s.location))].sort().forEach(name => {
        const o = document.createElement('option');
        o.value = name; o.textContent = name;
        srvLocSel.appendChild(o);
    });

    // funcs
    function renderLocations() {
        const search   = document.getElementById('loc-search').value.toLowerCase();
        const cat      = document.getElementById('loc-category').value;
        const region   = document.getElementById('loc-region').value;
        const rating   = document.getElementById('loc-rating').value;
        const sort     = document.getElementById('loc-sort').value;

        let rows = locations.filter(l => {
        const regionShort = l.region.split(',')[1]?.trim() || l.region;
        return (!search || l.name.toLowerCase().includes(search))
            && (!cat    || l.category === cat)
            && (!region || regionShort === region)
            && (!rating || l.rating === parseInt(rating));
        });

        if (sort === 'name-asc')     rows.sort((a,b) => a.name.localeCompare(b.name));
        if (sort === 'name-desc')    rows.sort((a,b) => b.name.localeCompare(a.name));
        if (sort === 'rating-desc')  rows.sort((a,b) => b.rating - a.rating);
        if (sort === 'rating-asc')   rows.sort((a,b) => a.rating - b.rating);

        document.getElementById('loc-count').textContent = `Showing ${rows.length} of ${locations.length} locations`;

        const tbody = document.getElementById('loc-tbody');
        tbody.innerHTML = '';
        rows.forEach(l => {
        const visibleTags = l.tags.slice(0, 2);
        const extra = l.tags.length - 2;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-name">${l.name}</td>
            <td><span class="badge">${l.category}</span></td>
            <td>${l.region}</td>
            <td>${starsSVG(l.rating)}</td>
            <td><div class="tags-cell">
            ${visibleTags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
            ${extra > 0 ? `<span class="tag-more">+${extra}</span>` : ''}
            </div></td>
        `;
        tbody.appendChild(tr);
        });
    }

    function renderSurveys() {
        const locF    = document.getElementById('srv-location').value;
        const ratingF = document.getElementById('srv-rating').value;
        const recF    = document.getElementById('srv-recommend').value;
        const sort    = document.getElementById('srv-sort').value;
        let rows = surveyData.filter(s =>
        (!locF    || s.location === locF)
        && (!ratingF || s.rating === parseInt(ratingF))
        && (!recF   || s.wouldRecommend === recF)
        );

        if (sort === 'date-desc')   rows.sort((a,b) => new Date(b.date) - new Date(a.date));
        if (sort === 'date-asc')    rows.sort((a,b) => new Date(a.date) - new Date(b.date));
        if (sort === 'rating-desc') rows.sort((a,b) => b.rating - a.rating);
        if (sort === 'rating-asc')  rows.sort((a,b) => a.rating - b.rating);

        document.getElementById('srv-count').textContent = `Showing ${rows.length} of ${surveyData.length} responses`;

        const tbody = document.getElementById('srv-tbody');
        tbody.innerHTML = '';
        rows.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color:var(--muted);font-size:0.85rem;white-space:nowrap;">${fmtDate(s.date)}</td>
            <td class="td-name">${s.location}</td>
            <td>${starsSVG(s.rating)}</td>
            <td><span class="badge ${badgeClass(s.safety)}">${s.safety.replace(/-/g,' ')}</span></td>
            <td><span class="badge ${badgeClass(s.cleanliness)}">${s.cleanliness.replace(/-/g,' ')}</span></td>
            <td><span class="badge ${badgeClass(s.accessibility)}">${s.accessibility.replace(/-/g,' ')}</span></td>
            <td><span class="badge ${badgeClass(s.wouldRecommend)}">${s.wouldRecommend.replace(/-/g,' ')}</span></td>
            <td><div class="truncate" title="${s.comments}">${s.comments}</div></td>
            <td>
                <button class="btn-delete" onclick="deleteSurvey(${surveyData.indexOf(s)})">
                <img src="icons/trash.svg" alt="lakbay" style="width: 1.1rem; height: 1.1rem;">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        });
    }

    // initial render
    renderLocations();
    renderSurveys();

    window.deleteSurvey = function(index) {
      if (!confirm('Delete this survey response?')) return;
      surveyData.splice(index, 1);
      document.getElementById('stat-responses').textContent = surveyData.length;
      renderSurveys();
    };

    // location filter listeners
    ['loc-search','loc-category','loc-region','loc-rating','loc-sort'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderLocations);
        document.getElementById(id).addEventListener('change', renderLocations);
    });
    document.getElementById('loc-reset').addEventListener('click', () => {
        document.getElementById('loc-search').value = '';
        document.getElementById('loc-category').value = '';
        document.getElementById('loc-region').value = '';
        document.getElementById('loc-rating').value = '';
        document.getElementById('loc-sort').value = 'name-asc';
        renderLocations();
    });

    // survey filter listeners
    ['srv-location','srv-rating','srv-recommend','srv-sort'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderSurveys);
    });
    document.getElementById('srv-reset').addEventListener('click', () => {
        document.getElementById('srv-location').value = '';
        document.getElementById('srv-rating').value = '';
        document.getElementById('srv-recommend').value = '';
        document.getElementById('srv-sort').value = 'date-desc';
        renderSurveys();
    });
    });
});