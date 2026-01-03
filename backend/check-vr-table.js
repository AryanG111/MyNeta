const db = require('./models');
const sequelize = db.sequelize;

async function checkTable() {
    try {
        const [results] = await sequelize.query("PRAGMA table_info(voter_requests)");
        console.log("Table Columns for voter_requests:");
        results.forEach(col => {
            console.log(`- ${col.name} (${col.type})`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTable();
