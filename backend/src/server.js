const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`\n========================================`);
  console.log(`  MY-NETA LOGIN CREDENTIALS`);
  console.log(`========================================`);
  console.log(`  ADMIN:`);
  console.log(`    Email:    subhash@myneta.app`);
  console.log(`    Password: Vedish0101`);
  console.log(`----------------------------------------`);
  console.log(`  VOLUNTEER:`);
  console.log(`    Email:    sahil@myneta.app`);
  console.log(`    Password: Sahil@6055`);
  console.log(`========================================\n`);
});

