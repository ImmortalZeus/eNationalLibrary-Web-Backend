/* eslint-disable */
// scripts/reset-db.js
// Wipes the database schema so the backend can rebuild it cleanly with the
// current entities. Needed when `synchronize: true` can't migrate existing data
// (e.g. adding NOT NULL columns, or changing a primary key / relationship).
//
// ⚠️  DESTRUCTIVE: drops ALL tables and data in the configured database.
//     Everything here is seed/test data, so that's fine — you re-seed afterward.
//
// Usage (from the backend folder):
//   node scripts/reset-db.js --yes
//
// Then:
//   1. npm run start:dev              # backend rebuilds a fresh schema
//   2. node scripts/seed-admin.js     # recreate admin: test@test.com / test
//   3. node scripts/seed-sample-data.js
//
// Reads DB settings from backend/.env.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

if (!process.argv.includes('--yes')) {
  console.log('This will DROP every table in the database (all data is lost).');
  console.log('Re-run with --yes to confirm:  node scripts/reset-db.js --yes');
  process.exit(0);
}

async function main() {
  const client = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'postgres',
  });

  await client.connect();
  console.log(`Connected to ${client.database}@${client.host}:${client.port}`);

  // Drop and recreate the public schema — clears every table, sequence and type.
  await client.query('DROP SCHEMA public CASCADE;');
  await client.query('CREATE SCHEMA public;');
  // Restore default privileges on the schema.
  await client.query(`GRANT ALL ON SCHEMA public TO ${client.user};`);
  await client.query('GRANT ALL ON SCHEMA public TO public;');

  await client.end();
  console.log('\n✅ Database reset. The schema is now empty.');
  console.log('Next:');
  console.log('  1. npm run start:dev               (rebuilds tables from the entities)');
  console.log('  2. node scripts/seed-admin.js      (admin: test@test.com / test)');
  console.log('  3. node scripts/seed-sample-data.js');
}

main().catch((err) => {
  console.error('Reset failed:', err.message);
  process.exit(1);
});
