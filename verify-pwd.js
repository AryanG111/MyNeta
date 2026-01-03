const path = require('path');
const process = require('process');
const bcrypt = require('bcrypt');

process.env.NODE_ENV = 'development';
const config = require('./backend/config/config.js').development;
config.storage = path.join(__dirname, 'backend', 'database.sqlite');
const { User } = require('./backend/models');

async function check() {
    const user = await User.findOne({ where: { email: 'aryanghait123@gmail.com' } });
    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('User found:', user.id, user.email, user.role, user.is_approved);
    console.log('Hash:', user.password_hash);

    // Check if 'password123' matches
    const testPassword = 'password123';
    const match = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`Does "${testPassword}" match? ${match}`);
}

check();
