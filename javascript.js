    /*To do (sa naka asssing dito at sa database): 
        1. Add form validation for email and password fields (e.g., check for valid email format, password strength).
        2. After validation sa database, redirect nalang sa home page pag user and admin dashboard pad admin. */
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
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

        // Confirm Password Toggle
        const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
        const confirmPasswordInput = document.querySelector('#confirmPassword');
        const iconEyeOpen2 = document.getElementById('iconEyeOpen2');
        const iconEyeHidden2 = document.getElementById('iconEyeHidden2');

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', function () {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);

                if (type === 'password') {
                    // password hidden → show open eye
                    iconEyeOpen2.style.display = 'block';
                    iconEyeHidden2.style.display = 'none';
                } else {
                    // password visible → show crossed eye
                    iconEyeOpen2.style.display = 'none';
                    iconEyeHidden2.style.display = 'block';
                }
            
            });
        }

       