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

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const role = document.querySelector('input[name="role"]:checked').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    
    // Show loading state
    loginBtn.querySelector('.btn-text').style.display = 'none';
    loginBtn.querySelector('.loading').style.display = 'inline-block';
    loginBtn.disabled = true;
    errorAlert.style.display = 'none';
    
    try {
        // For demo purposes, let's handle login locally first
        if (role === 'admin' && username === 'subhash@myneta.app' && password === 'Vedish0101') {
            // Admin login
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('username', username);
            localStorage.setItem('user', JSON.stringify({
                id: 1,
                name: 'Subhash Dhore',
                email: username,
                role: 'admin'
            }));
            window.location.href = 'admin-dashboard.html';
            return;
        } else if (role === 'volunteer' && username === 'sahil@myneta.app' && password === 'Sahil@6055') {
            // Volunteer login
            localStorage.setItem('userRole', 'volunteer');
            localStorage.setItem('username', username);
            localStorage.setItem('user', JSON.stringify({
                id: 2,
                name: 'Sahil Kangude',
                email: username,
                role: 'volunteer'
            }));
            window.location.href = 'volunteer-dashboard.html';
            return;
        } else if (role === 'voter') {
            // For voters, redirect to public dashboard
            localStorage.setItem('userRole', 'voter');
            localStorage.setItem('username', username);
            localStorage.setItem('user', JSON.stringify({
                id: 3,
                name: username,
                email: username,
                role: 'voter'
            }));
            window.location.href = 'public-dashboard.html';
            return;
        } else {
            // Try API login as fallback
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        email: username, 
                        password: password,
                        role: role 
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store token and user info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('userRole', data.user.role);
                    
                    // Redirect based on role
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (data.user.role === 'volunteer') {
                        window.location.href = 'volunteer-dashboard.html';
                    }
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (apiError) {
                // If API fails, show error
                throw new Error('Invalid credentials. Please check your username and password.');
            }
        }
    } catch (error) {
        errorAlert.textContent = error.message;
        errorAlert.style.display = 'block';
    } finally {
        // Reset button state
        loginBtn.querySelector('.btn-text').style.display = 'inline-block';
        loginBtn.querySelector('.loading').style.display = 'none';
        loginBtn.disabled = false;
    }
});

// Auto-fill demo credentials based on role selection
document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        
        if (this.value === 'admin') {
            usernameField.value = 'subhash@myneta.app';
            passwordField.value = 'Vedish0101';
        } else if (this.value === 'volunteer') {
            usernameField.value = 'sahil@myneta.app';
            passwordField.value = 'Sahil@6055';
        } else {
            usernameField.value = '';
            passwordField.value = '';
        }
    });
});


