document.addEventListener('DOMContentLoaded', () => {
	const avatarInput = document.getElementById('avatar');
	const preview = document.getElementById('avatarPreview');
	avatarInput.addEventListener('change', () => {
		const file = avatarInput.files[0];
		if (!file) return;
		if (!['image/jpeg','image/png'].includes(file.type)) {
			alert('Please upload JPG or PNG');
			avatarInput.value = '';
			preview.style.display = 'none';
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			alert('Max file size is 2MB');
			avatarInput.value = '';
			preview.style.display = 'none';
			return;
		}
		const url = URL.createObjectURL(file);
		preview.src = url;
		preview.style.display = 'inline-block';
	});

	const form = document.getElementById('volunteerForm');
	const errorAlert = document.getElementById('errorAlert');
	const successAlert = document.getElementById('successAlert');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const fd = new FormData(form);
		fd.set('name', document.getElementById('name').value.trim());
		fd.set('email', document.getElementById('email').value.trim());
		fd.set('phone', document.getElementById('phone').value.trim());
		fd.set('password', document.getElementById('password').value);
		fd.set('message', document.getElementById('message').value.trim());
		const file = avatarInput.files[0];
		if (file) fd.set('avatar', file);
		try {
			const res = await fetch('/api/volunteer/request', { method: 'POST', body: fd });
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to submit');
			showSuccess('Volunteer request submitted. Await admin approval.');
			form.reset();
			preview.style.display = 'none';
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


