const bcrypt = require('bcrypt');
const { User } = require('./models');

async function check() {
    const email = 'aryanghait123@gmail.com';
    const testPwd = 'Stableaf@123';

    // Try both cases
    const users = await User.findAll({ where: { role: 'volunteer' } });
    console.log(`Total volunteers: ${users.length}`);

    for (const u of users) {
        console.log(`- ID:${u.id} | Email: "${u.email}" | Mobile: "${u.mobile}"`);
        if (u.email.toLowerCase() === email.toLowerCase()) {
            const match = await bcrypt.compare(testPwd, u.password_hash);
            console.log(`  Password "${testPwd}" match: ${match}`);
        }
    }

    // Also check exact email match
    const exactUser = await User.findOne({ where: { email: email } });
    console.log(`\nExact lookup for "${email}":`, exactUser ? 'FOUND' : 'NOT FOUND');

    const lowerUser = await User.findOne({ where: { email: email.toLowerCase() } });
    console.log(`Lower lookup for "${email.toLowerCase()}":`, lowerUser ? 'FOUND' : 'NOT FOUND');

    process.exit(0);
}

check();
