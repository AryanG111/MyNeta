const bcrypt = require('bcrypt');
const { User } = require('./models');

async function check() {
    const user = await User.findOne({ where: { email: 'aryanghait123@gmail.com' } });
    if (!user) {
        console.log('User not found!');
        process.exit(1);
    }

    console.log('User found:', user.id, user.email, user.role, user.is_approved);
    console.log('Hash length:', user.password_hash?.length);

    // Check if 'password123' matches
    const testPassword = 'password123';
    const match = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`Does "${testPassword}" match? ${match}`);

    process.exit(0);
}

check();
