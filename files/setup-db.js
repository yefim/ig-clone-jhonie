const db = require('../db/db');

async function main() {
  await db.sync({force: true});

  console.log('Created database.');
}

main();
