document.addEventListener('DOMContentLoaded', () => {
	const passwordInput = document.getElementById('password');
	const toggleBtn = document.getElementById('togglePassword');
	const errorAlert = document.getElementById('errorAlert');
	const successAlert = document.getElementById('successAlert');
	const loginForm = document.getElementById('loginForm');
	const loginBtn = document.getElementById('loginBtn');

	if (toggleBtn && passwordInput) {
		toggleBtn.addEventListener('click', () => {
			const isHidden = passwordInput.getAttribute('type') === 'password';
			passwordInput.setAttribute('type', isHidden ? 'text' : 'password');
			const pressed = toggleBtn.getAttribute('aria-pressed') === 'true';
			toggleBtn.setAttribute('aria-pressed', (!pressed).toString());
			toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
			passwordInput.focus({ preventScroll: true });
		});
	}

	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			// Clear any pre-filled creds; no hard-coded values should exist
			const role = (new FormData(loginForm).get('role')) || 'voter';
			const identifier = /** @type {HTMLInputElement} */(document.getElementById('username')).value.trim();
			const password = passwordInput.value;
			if (!identifier || !password) {
				showError('Please enter your credentials.');
				return;
			}
			setLoading(true);
			try {
				const res = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ identifier, password, role })
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) throw new Error(data?.message || 'Login failed');
				showSuccess('Signed in successfully. Redirecting...');
				localStorage.setItem('authToken', data.token);
				localStorage.setItem('currentUser', JSON.stringify(data.user));
				setTimeout(() => {
					if (data.role === 'admin') window.location.href = '/admin-dashboard.html';
					else if (data.role === 'volunteer') window.location.href = '/volunteer-dashboard.html';
					else window.location.href = '/public-dashboard.html';
				}, 900);
			} catch (err) {
				showError(err.message || 'Unable to login.');
			} finally {
				setLoading(false);
			}
		});
	}

	function setLoading(loading) {
		if (!loginBtn) return;
		loginBtn.disabled = loading;
		const loadingEl = loginBtn.querySelector('.loading');
		const textEl = loginBtn.querySelector('.btn-text');
		if (loadingEl && textEl) {
			loadingEl.style.display = loading ? 'inline-flex' : 'none';
			textEl.style.display = loading ? 'none' : 'inline-flex';
		}
	}

	function showError(message) {
		if (errorAlert) {
			errorAlert.textContent = message;
			errorAlert.style.display = 'block';
		}
		if (successAlert) successAlert.style.display = 'none';
	}

	function showSuccess(message) {
		if (successAlert) {
			successAlert.textContent = message;
			successAlert.style.display = 'block';
		}
		if (errorAlert) errorAlert.style.display = 'none';
	}
});


