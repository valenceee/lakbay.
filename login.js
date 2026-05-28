const togglePw      = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');
const iconVisible   = document.getElementById('iconEyeVisible');
const iconHidden    = document.getElementById('iconEyeHidden');
    
window.addEventListener('load', (event) => {
    iconHidden.style.display = 'none';
});

// toggle

togglePw.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type  = isPassword ? 'text' : 'password';
    iconVisible.style.display = isPassword ? 'none'  : 'block';
    iconHidden.style.display  = isPassword ? 'block' : 'none';
});

// validations :'(
const form          = document.getElementById('loginForm');
const emailInput    = document.getElementById('email');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

function showError(input, errorEl) {
    input.classList.add('error-input');
    errorEl.style.display = 'block';
}

function clearError(input, errorEl) {
    input.classList.remove('error-input');
    errorEl.style.display = 'none';
}

emailInput.addEventListener('input', () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

function isValidEmail(email) {
  if (email.startsWith('-'))                        return false;
  if (email.startsWith('.'))                        return false;
  if (/[^a-zA-Z0-9@._+\-]/.test(email))             return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    return false;
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const emailVal = emailInput.value.trim();
  const pwVal    = passwordInput.value;

  if (!emailVal || !isValidEmail(emailVal)) {  
    showError(emailInput, emailError);
    valid = false;
  }

  if (pwVal.length < 6) {
    showError(passwordInput, passwordError);
    valid = false;
  }

  if (valid) {
    window.location.href = 'land.html';
  }
});