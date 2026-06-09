/* eslint-disable */
// scripts/dedupe-data.js
// Finds and removes duplicate Books, Authors, Publishers and Genres that were
// created by running a seed script more than once.
//
// For each table it groups rows by their natural key (title / name / label),
// keeps the OLDEST row of each group as the "canonical" one, re-points every
// reference (book<->author/genre/publisher join tables, borrow-records, reviews)
// at the canonical row, then deletes the duplicates. Everything runs in a single
// transaction, so if anything fails nothing is changed.
//
// It introspects the live schema (primary keys + foreign keys) from Postgres,
// so it works regardless of the exact table/column names TypeORM generated.
//
// Usage (from the backend folder):
//   node scripts/dedupe-data.js            # report AND remove duplicates
//   node scripts/dedupe-data.js --dry-run  # only report, change nothing
//
// Reads DB settings from backend/.env (DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME).

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { Client } = require('pg');

const DRY_RUN = process.argv.includes('--dry-run');

// table -> the column that identifies a logical duplicate
const TARGETS = [
  { table: 'genres', keyCol: 'label' },
  { table: 'authors', keyCol: 'name' },
  { table: 'publishers', keyCol: 'name' },
  { table: 'books', keyCol: 'title' },
];

const qIdent = (id) => `"${String(id).replace(/"/g, '""')}"`;

async function getPkCols(client, table) {
  const { rows } = await client.query(
    `SELECT att.attname AS col
       FROM pg_index i
       JOIN pg_attribute att ON att.attrelid = i.indrelid AND att.attnum = ANY (i.indkey)
      WHERE i.indrelid = $1::regclass AND i.indisprimary`,
    [qIdent(table)],
  );
  return rows.map((r) => r.col);
}

async function getColumns(client, table) {
  const { rows } = await client.query(
    `SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position`,
    [table],
  );
  return rows.map((r) => r.column_name);
}

// every (childTable, childCol) that has a FK pointing at `table`
async function getReferencingFks(client, table) {
  const { rows } = await client.query(
    `SELECT cl.relname AS child_table, att.attname AS child_col
       FROM pg_constraint con
       JOIN pg_class cl ON cl.oid = con.conrelid
       JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
      WHERE con.contype = 'f' AND con.confrelid = $1::regclass`,
    [qIdent(table)],
  );
  return rows.map((r) => ({ childTable: r.child_table, childCol: r.child_col }));
}

// duplicate groups: keep the oldest (lowest ctid) as canonical
async function getDuplicateGroups(client, table, pkCol, keyCol) {
  const { rows } = await client.query(
    `SELECT ${qIdent(pkCol)} AS id, ${qIdent(keyCol)} AS key, ctid
       FROM ${qIdent(table)}
      ORDER BY ctid`,
  );
  const byKey = new Map();
  for (const r of rows) {
    const k = (r.key ?? '').trim();
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(r.id);
  }
  const groups = [];
  for (const [key, ids] of byKey) {
    if (ids.length > 1) groups.push({ key, canonical: ids[0], dups: ids.slice(1) });
  }
  return groups;
}

// delete byte-for-byte identical rows in a join table, keeping one of each
async function dedupeExactRows(client, table) {
  const cols = await getColumns(client, table);
  if (cols.length === 0) return;
  const matches = cols
    .map((c) => `a.${qIdent(c)} IS NOT DISTINCT FROM b.${qIdent(c)}`)
    .join(' AND ');
  await client.query(
    `DELETE FROM ${qIdent(table)} a
       USING ${qIdent(table)} b
      WHERE a.ctid > b.ctid AND ${matches}`,
  );
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
  console.log(DRY_RUN ? '\n*** DRY RUN — no changes will be made ***\n' : '');

  await client.query('BEGIN');
  let totalRemoved = 0;

  try {
    for (const { table, keyCol } of TARGETS) {
      const pkCols = await getPkCols(client, table);
      if (pkCols.length !== 1) {
        console.log(`! Skipping ${table} (expected a single-column primary key).`);
        continue;
      }
      const pkCol = pkCols[0];
      const groups = await getDuplicateGroups(client, table, pkCol, keyCol);

      if (groups.length === 0) {
        console.log(`✓ ${table}: no duplicates.`);
        continue;
      }

      const dupCount = groups.reduce((n, g) => n + g.dups.length, 0);
      console.log(`• ${table}: ${groups.length} duplicated ${keyCol}(s), ${dupCount} extra row(s) to remove:`);
      for (const g of groups) console.log(`    "${g.key}" → keep 1, remove ${g.dups.length}`);

      if (DRY_RUN) { totalRemoved += dupCount; continue; }

      const refs = await getReferencingFks(client, table);
      const joinTablesTouched = new Set();

      for (const g of groups) {
        for (const { childTable, childCol } of refs) {
          const childPk = await getPkCols(client, childTable);
          if (childPk.length === 1) {
            // entity table with a normal FK column → just re-point it
            await client.query(
              `UPDATE ${qIdent(childTable)} SET ${qIdent(childCol)} = $1
                WHERE ${qIdent(childCol)} = ANY($2::uuid[])`,
              [g.canonical, g.dups],
            );
          } else {
            // many-to-many join table → add canonical links, drop duplicate-side links
            const cols = await getColumns(client, childTable);
            const selectList = cols
              .map((c) => (c === childCol ? `$1` : qIdent(c)))
              .join(', ');
            await client.query(
              `INSERT INTO ${qIdent(childTable)} (${cols.map(qIdent).join(', ')})
               SELECT ${selectList} FROM ${qIdent(childTable)}
                WHERE ${qIdent(childCol)} = ANY($2::uuid[])
               ON CONFLICT DO NOTHING`,
              [g.canonical, g.dups],
            );
            await client.query(
              `DELETE FROM ${qIdent(childTable)} WHERE ${qIdent(childCol)} = ANY($1::uuid[])`,
              [g.dups],
            );
            joinTablesTouched.add(childTable);
          }
        }
      }

      // clean any accidental identical rows left in join tables
      for (const jt of joinTablesTouched) await dedupeExactRows(client, jt);

      // finally remove the duplicate parent rows
      const allDups = groups.flatMap((g) => g.dups);
      await client.query(
        `DELETE FROM ${qIdent(table)} WHERE ${qIdent(pkCol)} = ANY($1::uuid[])`,
        [allDups],
      );
      totalRemoved += allDups.length;
    }

    if (DRY_RUN) {
      await client.query('ROLLBACK');
      console.log(`\nDry run complete. ${totalRemoved} duplicate row(s) WOULD be removed. Re-run without --dry-run to apply.`);
    } else {
      await client.query('COMMIT');
      console.log(`\n✅ Done. Removed ${totalRemoved} duplicate row(s).`);
    }
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('\n❌ Failed — rolled back, no changes made:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Dedupe failed:', err.message);
  process.exit(1);
});
