const db = require('./models');
const { User, Voter } = db;

async function check() {
    try {
        const users = await User.findAll({ where: { role: 'voter' } });
        console.log(`Found ${users.length} voter users.`);
        for (const user of users) {
            const voter = await Voter.findOne({ where: { user_id: user.id } });
            console.log(`User ID: ${user.id} | Email: ${user.email} | Voter: ${voter ? voter.id : 'MISSING'}`);
        }

        const allVoters = await Voter.findAll();
        console.log(`\nTotal Voters in table: ${allVoters.length}`);
        for (const v of allVoters) {
            console.log(`Voter ID: ${v.id} | UserID field: ${v.user_id}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
