// Password visibility toggle
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const icon = this.querySelector('i');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Show/hide area field based on role selection
document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const areaField = document.getElementById('areaField');
        if (this.value === 'volunteer') {
            areaField.style.display = 'block';
        } else {
            areaField.style.display = 'none';
        }
    });
});

// Registration form submission
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const role = document.querySelector('input[name="role"]:checked').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const area = document.getElementById('area').value;
    const registerBtn = document.getElementById('registerBtn');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorAlert.textContent = 'Passwords do not match';
        errorAlert.style.display = 'block';
        return;
    }
    
    // Show loading state
    registerBtn.querySelector('.btn-text').style.display = 'none';
    registerBtn.querySelector('.loading').style.display = 'inline-block';
    registerBtn.disabled = true;
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name,
                email,
                mobile,
                password,
                role,
                area: role === 'volunteer' ? area : null
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            successAlert.textContent = role === 'volunteer' 
                ? 'Account created successfully! Your account is pending admin approval.'
                : 'Account created successfully! You can now login.';
            successAlert.style.display = 'block';
            
            // Reset form
            document.getElementById('registerForm').reset();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 3000);
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        errorAlert.textContent = error.message;
        errorAlert.style.display = 'block';
    } finally {
        // Reset button state
        registerBtn.querySelector('.btn-text').style.display = 'inline-block';
        registerBtn.querySelector('.loading').style.display = 'none';
        registerBtn.disabled = false;
    }
});








