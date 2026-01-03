const bcrypt = require('bcrypt');
const { User } = require('./models');

async function check() {
    const email = 'aryanghait123@gmail.com';
    const passwords = ['Stableaf@123', 'Password123', 'password123'];

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
        console.log('NOT FOUND');
        process.exit(1);
    }

    console.log('User:', user.email, '| Role:', user.role, '| Approved:', user.is_approved);
    console.log('Hash (first 20):', user.password_hash?.substring(0, 20));

    for (const pwd of passwords) {
        const match = await bcrypt.compare(pwd, user.password_hash);
        console.log(`"${pwd}" => ${match ? 'MATCH!' : 'no match'}`);
    }

    process.exit(0);
}

check();
