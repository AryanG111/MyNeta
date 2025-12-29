document.addEventListener('DOMContentLoaded', () => {
	const allowedLocalities = ["Ram Bagh Colony", "Shivtirth Nagar", "Arandavana", "Mathura Kunj", "Rohini Kunj"];
	const localitySelect = document.getElementById('locality');
	allowedLocalities.forEach(loc => {
		const opt = document.createElement('option');
		opt.value = loc;
		opt.textContent = loc;
		localitySelect.appendChild(opt);
	});

	const form = document.getElementById('voterForm');
	const errorAlert = document.getElementById('errorAlert');
	const successAlert = document.getElementById('successAlert');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value.trim();
		const email = document.getElementById('email').value.trim();
		const phone = document.getElementById('phone').value.trim();
		const password = document.getElementById('password').value;
		const address = document.getElementById('address').value.trim();
		const epic_no = document.getElementById('epic_no').value.trim();
		const locality = localitySelect.value;

		if (!allowedLocalities.includes(locality)) {
			return showError('Please select a locality from the Ward 11 list');
		}

		try {
			const res = await fetch('/api/auth/register-voter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, phone, password, address: `${address}, ${locality}`, epic_no })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Registration failed');
			showSuccess('Account created successfully. Redirecting to login...');
			setTimeout(() => window.location.href = '/login.html', 2500);
		} catch (e) {
			showError(e.message);
		}
	});

	function showError(msg) {
		errorAlert.textContent = msg;
		errorAlert.classList.remove('d-none');
		successAlert.classList.add('d-none');
	}
	function showSuccess(msg) {
		successAlert.textContent = msg;
		successAlert.classList.remove('d-none');
		errorAlert.classList.add('d-none');
	}
});


