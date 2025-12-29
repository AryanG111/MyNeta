const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { randomUUID } = require('crypto');

const AVATAR_DIR = path.join(__dirname, '../../uploads/avatars');
fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, AVATAR_DIR),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase();
		const id = randomUUID();
		cb(null, `avatar_${id}${ext}`);
	}
});

function fileFilter(req, file, cb) {
	const ext = path.extname(file.originalname).toLowerCase();
	const ok = ['.jpg','.jpeg','.png'].includes(ext);
	if (!ok) return cb(new Error('Invalid file type'));
	cb(null, true);
}

const uploadAvatar = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = { uploadAvatar };


