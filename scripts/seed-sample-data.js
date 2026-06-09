/* eslint-disable */
// scripts/seed-sample-data.js
// Populates the library with a small sample dataset so the admin/reader pages
// have something to show.  It talks to the RUNNING backend over HTTP (it does
// NOT touch the database directly), so TypeORM handles all the book<->author/
// genre/publisher relations for us.
//
// Prerequisites:
//   1. Backend running:            npm run start:dev
//   2. Admin account seeded:       node scripts/seed-admin.js   (test@test.com / test)
//
// Run:
//   node scripts/seed-sample-data.js
//
// Optional: override the API base URL with API_URL (default http://localhost:3000/api).

const API = process.env.API_URL || 'http://localhost:3000/api';

let token = null;

async function req(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const msg = data && data.message ? (Array.isArray(data.message) ? data.message.join(', ') : data.message) : text;
    throw new Error(`${method} ${path} -> ${res.status}: ${msg}`);
  }
  return data;
}

const today = new Date();
const iso = (d) => d.toISOString().split('T')[0];
const plusDays = (n) => iso(new Date(today.getTime() + n * 86400000));

async function main() {
  // ── 1. Log in as the seeded admin (needed to create books — that route is guarded) ──
  try {
    const login = await req('POST', '/auth/login', { usernameOrEmail: 'test@test.com', password: 'test' });
    token = login.accessToken;
    console.log('Logged in as admin.');
  } catch (e) {
    console.error('\n❌ Could not log in as admin:', e.message);
    console.error('   Make sure the backend is running AND you ran:  node scripts/seed-admin.js');
    process.exit(1);
  }

  // ── 2. Genres ───────────────────────────────────────────────────────────────
  const genreDefs = [
    { label: 'Fiction',    description: 'Novels and literary fiction.' },
    { label: 'Technology', description: 'Software, engineering and computing.' },
    { label: 'History',    description: 'Historical accounts and analysis.' },
    { label: 'Politics',   description: 'Political theory and ideology.' },
  ];
  const genre = {};
  for (const g of genreDefs) genre[g.label] = await req('POST', '/genres', g);
  console.log(`Created ${Object.keys(genre).length} genres.`);

  // ── 3. Publishers ───────────────────────────────────────────────────────────
  const publisherDefs = [
    { name: 'Prentice Hall',          description: 'Technical and academic publisher.' },
    { name: 'Addison-Wesley',         description: 'Computer science publisher.' },
    { name: 'Harper',                 description: 'General trade publisher.' },
    { name: 'Secker & Warburg',       description: 'British literary publisher.' },
    { name: 'Franz Eher Nachfolger',  description: 'Historical publishing house.' },
  ];
  const publisher = {};
  for (const p of publisherDefs) publisher[p.name] = await req('POST', '/publishers', p);
  console.log(`Created ${Object.keys(publisher).length} publishers.`);

  // ── 4. Authors ──────────────────────────────────────────────────────────────
  const authorDefs = [
    { name: 'Robert C. Martin',  dateOfBirth: '1952-12-05', description: 'Software engineer, author of Clean Code.' },
    { name: 'Andrew Hunt',       dateOfBirth: '1964-01-01', description: 'Co-author of The Pragmatic Programmer.' },
    { name: 'David Thomas',      dateOfBirth: '1956-01-01', description: 'Co-author of The Pragmatic Programmer.' },
    { name: 'Yuval Noah Harari', dateOfBirth: '1976-02-24', description: 'Historian and author of Sapiens.' },
    { name: 'George Orwell',     dateOfBirth: '1903-06-25', dateOfDeath: '1950-01-21', description: 'English novelist and essayist.' },
    { name: 'Adolf Hitler',      dateOfBirth: '1889-04-20', dateOfDeath: '1945-04-30', description: 'Author of the autobiographical manifesto (included for testing only).' },
  ];
  const author = {};
  for (const a of authorDefs) author[a.name] = await req('POST', '/authors', a);
  console.log(`Created ${Object.keys(author).length} authors.`);

  // ── 5. Books (5) ────────────────────────────────────────────────────────────
  const bookDefs = [
    {
      title: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship.',
      previewUrl: 'https://placehold.co/200x300?text=Clean+Code',
      authors: ['Robert C. Martin'], genres: ['Technology'], publishers: ['Prentice Hall'],
    },
    {
      title: 'The Pragmatic Programmer',
      description: 'Your Journey to Mastery.',
      previewUrl: 'https://placehold.co/200x300?text=Pragmatic+Programmer',
      authors: ['Andrew Hunt', 'David Thomas'], genres: ['Technology'], publishers: ['Addison-Wesley'],
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      description: 'A sweeping history of the human species.',
      previewUrl: 'https://placehold.co/200x300?text=Sapiens',
      authors: ['Yuval Noah Harari'], genres: ['History'], publishers: ['Harper'],
    },
    {
      title: '1984',
      description: 'A dystopian novel about totalitarian surveillance.',
      previewUrl: 'https://placehold.co/200x300?text=1984',
      authors: ['George Orwell'], genres: ['Fiction'], publishers: ['Secker & Warburg'],
    },
    {
      // The prank entry — remove before any live demo.
      title: 'Mein Kampf',
      description: 'Historical political manifesto. Included only as test data — remove before demo.',
      previewUrl: 'https://placehold.co/200x300?text=Mein+Kampf',
      authors: ['Adolf Hitler'], genres: ['History', 'Politics'], publishers: ['Franz Eher Nachfolger'],
    },
  ];

  const bookIds = {};
  for (const b of bookDefs) {
    const payload = {
      title: b.title,
      description: b.description,
      previewUrl: b.previewUrl,
      authorIds: b.authors.map((n) => author[n]),
      genreIds: b.genres.map((n) => genre[n]),
      publisherIds: b.publishers.map((n) => publisher[n]),
    };
    bookIds[b.title] = await req('POST', '/books', payload);
    console.log(`  + book: ${b.title}`);
  }
  console.log(`Created ${Object.keys(bookIds).length} books.`);

  // ── 6. A sample reader (so the Readers page isn't empty) ─────────────────────
  let readerId = null;
  try {
    readerId = await req('POST', '/readers', {
      address: '123 Library Lane',
      user: {
        username: 'reader1',
        email: 'reader@test.com',
        password: 'reader123',
        gender: 'Male',
        phoneNumber: null,
        role: 'Reader',
        status: 'Active',
      },
    });
    console.log('Created sample reader (reader@test.com / reader123).');
  } catch (e) {
    console.log('Skipped sample reader:', e.message);
  }

  // ── 7. A borrow record + reading card for that reader (populates those pages) ─
  if (readerId) {
    try {
      await req('POST', '/borrow-records', {
        quantity: 1,
        borrowDate: plusDays(-7),
        dueDate: plusDays(7),
        readerId,
        bookId: bookIds['1984'],
      });
      console.log('Created a sample borrow record.');
    } catch (e) { console.log('Skipped borrow record:', e.message); }

    try {
      await req('POST', '/reading-cards', {
        label: 'Standard Membership',
        type: 'Normal',
        activationDate: iso(today),
        expiryDate: plusDays(365),
        readerId,
      });
      console.log('Created a sample reading card.');
    } catch (e) { console.log('Skipped reading card:', e.message); }
  }

  console.log('\n✅ Sample data seeded. Refresh the admin console to see it.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
