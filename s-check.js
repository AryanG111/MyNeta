const path = require('path');
const process = require('process');
process.env.NODE_ENV = 'development';
const config = require('./backend/config/config.js').development;
config.storage = path.join(__dirname, 'backend', 'database.sqlite');
const { User } = require('./backend/models');

async function check() {
    const users = await User.findAll({ where: { role: 'volunteer' } });
    for (const u of users) {
        console.log(`U_ID:${u.id}|E:>>${u.email}<<|M:>>${u.mobile}<<`);
    }
}
check();
