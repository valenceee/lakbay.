    const togglePassword = document.querySelector('#togglePassword');
        const passwordInput = document.querySelector('#password');
        const iconEyeOpen = document.getElementById('iconEyeOpen');
        const iconEyeHidden = document.getElementById('iconEyeHidden');

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            if (type === 'password') {
                // password hidden → show open eye
                iconEyeOpen.style.display = 'block';
                iconEyeHidden.style.display = 'none';
            } else {
                // password visible → show crossed eye
                iconEyeOpen.style.display = 'none';
                iconEyeHidden.style.display = 'block';
            }
        
        });
