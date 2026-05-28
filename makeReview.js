let selectedRating = 0;
let locationId     = null;
let locationName   = '';

// read ?id= from URL and load location name 
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  locationId = params.get('id');

  if (!locationId) {
    window.location.href = 'land.html';
    return;
  }

  // update back link and cancel button to go back to the right location
  document.getElementById('back-link').href  = `location.html?id=${locationId}`;
  document.getElementById('btn-cancel').href = `location.html?id=${locationId}`;

  // fetch location name from data.json
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const location = data.locations.find(l => l.id === locationId);
      if (location) {
        locationName = location.name;
        document.getElementById('review-subtitle').textContent = `Share your experience at ${locationName}`;
        document.getElementById('back-link').textContent       = `← Back to ${locationName}`;
        document.title = `Review - ${locationName} | lakbay.`;
      }
    });

  initStarRating();
  initFormValidation();
});

// star 
function initStarRating() {
  const starBtns = document.querySelectorAll('.star-btn');

  starBtns.forEach(btn => {
    // click - set rating
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.star);
      updateStars(selectedRating);
      document.getElementById('starError').style.display = 'none';
    });

    // hover - preview
    btn.addEventListener('mouseenter', () => {
      updateStars(parseInt(btn.dataset.star));
    });

    // mouse leave - revert to selected
    btn.addEventListener('mouseleave', () => {
      updateStars(selectedRating);
    });
  });
}

function updateStars(count) {
  document.querySelectorAll('.star-btn img').forEach((img, i) => {
    if (i < count) {
      img.src = 'icons/star_filled.svg';
      img.classList.remove('empty');
      img.classList.add('filled');
    } else {
      img.src = 'icons/star_unfilled.svg';
      img.classList.remove('filled');
      img.classList.add('empty');
    }
  });
}

// formm validation
function initFormValidation() {
  const form = document.getElementById('review-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    let firstInvalid = null; // ← tracks the first skipped field

    // star rating
    if (selectedRating === 0) {
      document.getElementById('starError').style.display = 'block';
      if (!firstInvalid) firstInvalid = document.getElementById('star-rating');
      valid = false;
    }

    // visit date
    const visitDate = document.getElementById('visit-date');
    const today     = new Date().toISOString().split('T')[0];

    if (!visitDate.value) {
      visitDate.style.outline = '2px solid #ef4444';
      if (!firstInvalid) firstInvalid = visitDate;
      valid = false;
    } else if (visitDate.value > today) {
      visitDate.style.outline = '2px solid #ef4444';
      if (!firstInvalid) firstInvalid = visitDate;
      valid = false;
    } else {
      visitDate.style.outline = '';
    }

    // all required selects
    const requiredSelects = form.querySelectorAll('select[required]');
    requiredSelects.forEach(select => {
      if (!select.value) {
        select.style.boxShadow = '0 0 0 2px #ef4444';
        if (!firstInvalid) firstInvalid = select; // ← only saves the first one
        valid = false;
      } else {
        select.style.boxShadow = '';
      }

      select.addEventListener('change', () => {
        select.style.boxShadow = '';
      }, { once: true });
    });

    // additional comments
    const comments = document.getElementById('additional-comments');
    if (comments.value.trim().length < 20) {
      document.getElementById('commentsError').style.display = 'block';
      if (!firstInvalid) firstInvalid = comments;
      valid = false;
    } else {
      document.getElementById('commentsError').style.display = 'none';
    }

    // confirmation checkbox
    const confirm = document.getElementById('confirm-review');
    if (!confirm.checked) {
      document.getElementById('confirmError').style.display = 'block';
      if (!firstInvalid) firstInvalid = confirm;
      valid = false;
    } else {
      document.getElementById('confirmError').style.display = 'none';
    }

    // ← scroll to first invalid field
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus({ preventScroll: true });
    }

    if (valid) {
      submitReview();
    }
  });

  document.getElementById('additional-comments').addEventListener('input', () => {
    if (document.getElementById('additional-comments').value.trim().length >= 20) {
      document.getElementById('commentsError').style.display = 'none';
    }
  });

  document.getElementById('confirm-review').addEventListener('change', () => {
    document.getElementById('confirmError').style.display = 'none';
  });
}

  // clear comments error on input
  document.getElementById('additional-comments').addEventListener('input', () => {
    if (document.getElementById('additional-comments').value.trim().length >= 20) {
      document.getElementById('commentsError').style.display = 'none';
    }
  });

  // clear confirm error on change
  document.getElementById('confirm-review').addEventListener('change', () => {
    document.getElementById('confirmError').style.display = 'none';
  });


// submit 
function submitReview() {
  // show success message
  document.querySelector('.review-card').innerHTML = `
    <div class="success-card">
      <h1>Thank you!</h1>
      <p>Your review for <strong>${locationName}</strong> has been submitted.</p>
    </div>
  `;  
}
