const togglePw      = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');
const iconVisible   = document.getElementById('iconEyeVisible');
const iconHidden    = document.getElementById('iconEyeHidden');

iconHidden.style.display = 'none';

togglePw.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type            = isPassword ? 'text'  : 'password';
  iconVisible.style.display     = isPassword ? 'none'  : 'block';
  iconHidden.style.display      = isPassword ? 'block' : 'none';
});

// ── Inputs ──
const form           = document.getElementById('loginForm');
const lastNameInput  = document.getElementById('lastName');
const firstNameInput = document.getElementById('firstName');
const emailInput     = document.getElementById('email');
const addressInput   = document.getElementById('address');
const termsInput     = document.getElementById('terms');

const lastNameError  = document.getElementById('lastNameError');
const firstNameError = document.getElementById('firstNameError');
const emailError     = document.getElementById('emailError');
const passwordError  = document.getElementById('passwordError');
const addressError   = document.getElementById('addressError');
const termsError = document.getElementById('termsError');


// ── Helpers ──
function showError(input, errorEl) {
  input.classList.add('error-input');
  errorEl.style.display = 'block';
}

function clearError(input, errorEl) {
  input.classList.remove('error-input');
  errorEl.style.display = 'none';
}

// clear on input
lastNameInput.addEventListener('input',  () => clearError(lastNameInput,  lastNameError));
firstNameInput.addEventListener('input', () => clearError(firstNameInput, firstNameError));
emailInput.addEventListener('input',     () => clearError(emailInput,     emailError));
passwordInput.addEventListener('input',  () => clearError(passwordInput,  passwordError));
addressInput.addEventListener('change',  () => clearError(addressInput,   addressError));

// ── Validators ──
function isValidName(name) {
  if (name.length < 2)                      return false; 
  if (/[^a-zA-ZÀ-ÖØ-öø-ÿ\s'\-]/.test(name)) return false; 
  if (name.startsWith('-'))                 return false;
  if (name.startsWith('.'))                 return false;
  return true;
}

function isValidEmail(email) {
  if (email.startsWith('-'))                       return false;
  if (email.startsWith('.'))                       return false;
  if (/[^a-zA-Z0-9@._+\-]/.test(email))            return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   return false;
  return true;
}

termsInput.addEventListener('change', () => {
  termsError.style.display = 'none';
  termsInput.classList.remove('error-input');
});

// ── Submit ──
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const lastNameVal  = lastNameInput.value.trim();
  const firstNameVal = firstNameInput.value.trim();
  const emailVal     = emailInput.value.trim();
  const pwVal        = passwordInput.value;
  const addressVal   = addressInput.value;

  if (!lastNameVal || !isValidName(lastNameVal)) {
    showError(lastNameInput, lastNameError);
    valid = false;
  }

  if (!firstNameVal || !isValidName(firstNameVal)) {
    showError(firstNameInput, firstNameError);
    valid = false;
  }

  if (!emailVal || !isValidEmail(emailVal)) {
    showError(emailInput, emailError);
    valid = false;
  }

  if (pwVal.length < 6) {
    showError(passwordInput, passwordError);
    valid = false;
  }

  if (!addressVal) {
    showError(addressInput, addressError);
    valid = false;
  }

  if (!termsInput.checked) {
    termsError.style.display = 'block';
    termsInput.classList.add('error-input');
    valid = false;
  } else {
    termsError.style.display = 'none';
    termsInput.classList.remove('error-input');
  }

  if (valid) {
    window.location.href = 'land.html';
  }
});

