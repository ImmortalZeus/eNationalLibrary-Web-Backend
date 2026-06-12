/* eslint-disable */
// scripts/seed-sample-data.js
// Prerequisites:
//   1. Backend running:            npm run start:dev
//   2. Admin account seeded:       node scripts/seed-admin.js
//   3. Book cover images in frontend public/book-covers/
//
// Run:  node scripts/seed-sample-data.js

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
    const msg = data?.message
      ? (Array.isArray(data.message) ? data.message.join(', ') : data.message)
      : text;
    throw new Error(`${method} ${path} -> ${res.status}: ${msg}`);
  }
  return data;
}

const today = new Date();
const iso = (d) => d.toISOString().split('T')[0];
const plusDays = (n) => iso(new Date(today.getTime() + n * 86400000));

async function main() {
  // ── 1. Login ─────────────────────────────────────────────────────────────
  try {
    const login = await req('POST', '/auth/login', { usernameOrEmail: 'test@test.com', password: 'test' });
    token = login.accessToken;
    console.log('✅ Logged in as admin.');
  } catch (e) {
    console.error('❌ Could not log in as admin:', e.message);
    console.error('   Make sure backend is running AND you ran: node scripts/seed-admin.js');
    process.exit(1);
  }

  // ── 2. Genres ─────────────────────────────────────────────────────────────
  console.log('\nCreating genres...');
  const genreDefs = [
    { label: 'Fiction',     description: 'Novels and literary fiction.' },
    { label: 'Technology',  description: 'Software, engineering and computing.' },
    { label: 'History',     description: 'Historical accounts and analysis.' },
    { label: 'Politics',    description: 'Political theory and ideology.' },
    { label: 'Math',        description: 'Mathematics including calculus, statistics, and algebra.' },
    { label: 'Physics',     description: 'Physical sciences including mechanics and quantum physics.' },
    { label: 'IT',          description: 'Information technology including AI, ML, and cryptography.' },
    { label: 'Biography',   description: 'Biographies and memoirs.' },
  ];
  const genre = {};
  for (const g of genreDefs) {
    genre[g.label] = await req('POST', '/genres', g);
    console.log(`  + genre: ${g.label}`);
  }

  // ── 3. Publishers ─────────────────────────────────────────────────────────
  console.log('\nCreating publishers...');
  const publisherDefs = [
    { name: 'Prentice Hall',                    description: 'Technical and academic publisher.' },
    { name: 'Addison-Wesley',                   description: 'Computer science publisher.' },
    { name: 'Harper',                           description: 'General trade publisher.' },
    { name: 'Secker & Warburg',                 description: 'British literary publisher.' },
    { name: 'Franz Eher Nachfolger',            description: 'Historical publishing house.' },
    { name: 'Bach Khoa Publishing',             description: 'Publisher of scientific and technical books.' },
    { name: 'Vietnam Education Publishing House', description: 'National educational publisher of Vietnam.' },
    { name: 'CRC Press',                        description: 'Publisher of scientific and technical books.' },
    { name: 'Self Published',                   description: 'Open access academic publication.' },
    { name: 'Bui Cong Minh Publishing',          description: 'Publisher of Bui Cong Minh\'s works.' },
    { name: 'Phung Thanh Do Publishing',        description: 'Publisher of Phung Thanh Do\'s works.' },
  ];
  const publisher = {};
  for (const p of publisherDefs) {
    publisher[p.name] = await req('POST', '/publishers', p);
    console.log(`  + publisher: ${p.name}`);
  }

  // ── 4. Authors ────────────────────────────────────────────────────────────
  console.log('\nCreating authors...');
  const authorDefs = [
    { name: 'Robert C. Martin',     dateOfBirth: '1952-12-05', description: 'Software engineer, author of Clean Code.' },
    { name: 'Andrew Hunt',          dateOfBirth: '1964-01-01', description: 'Co-author of The Pragmatic Programmer.' },
    { name: 'Adolf Hitler',         dateOfBirth: '1889-04-20', dateOfDeath: '1945-04-30', description: 'German politician and leader of the Nazi Party.' }, 
    { name: 'Phung Thanh Do',       dateOfBirth: '1950-01-01', description: 'Vietnamese journalist and political analyst.' },
    { name: 'Bui Cong Minh',        dateOfBirth: '1998-01-01', description: 'Young Vietnamese author and storyteller.' },
    { name: 'David Thomas',         dateOfBirth: '1956-01-01', description: 'Co-author of The Pragmatic Programmer.' },
    { name: 'Yuval Noah Harari',    dateOfBirth: '1976-02-24', description: 'Historian and author of Sapiens.' },
    { name: 'George Orwell',        dateOfBirth: '1903-06-25', dateOfDeath: '1950-01-21', description: 'English novelist and essayist.' },
    { name: 'Doan Cong Dinh',       dateOfBirth: '1970-01-01', description: 'Professor at Hanoi University of Science and Technology.' },
    { name: 'Tran Thi Kim Oanh',    dateOfBirth: '1970-01-01', description: 'Professor at Hanoi University of Science and Technology.' },
    { name: 'Nguyen Thieu Huy',     dateOfBirth: '1970-01-01', description: 'Professor at Hanoi University of Science and Technology.' },
    { name: 'Bui Minh Tri',         dateOfBirth: '1970-01-01', description: 'Associate Professor at Hanoi University of Science and Technology.' },
    { name: 'Luong Duyen Binh',     dateOfBirth: '1950-01-01', description: 'Chief editor and professor of general physics.' },
    { name: 'Dan Boneh',            dateOfBirth: '1969-01-01', description: 'Professor of cryptography at Stanford University.' },
    { name: 'Victor Shoup',         dateOfBirth: '1962-01-01', description: 'Professor of computer science at NYU.' },
    { name: 'Stephen Marsland',     dateOfBirth: '1972-01-01', description: 'Professor specializing in machine learning and pattern recognition.' },
    { name: 'Mahmoud Hassaballah',  dateOfBirth: '1975-01-01', description: 'Researcher in digital imaging and computer vision.' },
    { name: 'Ali Ismail Awad',      dateOfBirth: '1978-01-01', description: 'Researcher in computer vision and security.' },
  ];
  const author = {};
  for (const a of authorDefs) {
    author[a.name] = await req('POST', '/authors', a);
    console.log(`  + author: ${a.name}`);
  }

  // ── 5. Books ──────────────────────────────────────────────────────────────
  console.log('\nCreating books...');
  const bookDefs = [
    // ── Original sample books ──
    {
      title: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship — best practices for writing clean, maintainable code.',
      previewUrl: '/book-covers/cleancode.jpg',
      authors: ['Robert C. Martin'], genres: ['Technology'], publishers: ['Prentice Hall'],
    },
    {
      title: 'Mein Kampf',
      description: 'A Handbook of Agile Software Craftsmanship — best practices for writing clean, maintainable code.',
      previewUrl: '/book-covers/mein-kampf.jpg',
      authors: ['Adolf Hitler'], genres: ['Politics', 'History'], publishers: ['Franz Eher Nachfolger'],
    },
    {
      title: 'The Pragmatic Programmer',
      description: 'Your Journey to Mastery — timeless advice for software developers.',
      previewUrl: '/book-covers/pragmatic_programmer.jpg',
      authors: ['Andrew Hunt', 'David Thomas'], genres: ['Technology'], publishers: ['Addison-Wesley'],
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      description: 'A sweeping history of the human species from Stone Age to the present.',
      previewUrl: '/book-covers/Sapiens.jpg',
      authors: ['Yuval Noah Harari'], genres: ['History'], publishers: ['Harper'],
    },
    {
      title: '1984',
      description: 'A dystopian novel about totalitarian surveillance and the destruction of truth.',
      previewUrl: '/book-covers/1984.jpg',
      authors: ['George Orwell'], genres: ['Fiction'], publishers: ['Secker & Warburg'],
    },
    // ── Math books ──
    {
      title: 'Calculus I',
      description: 'An introductory course in calculus covering limits, derivatives, and integrals for engineering students.',
      previewUrl: '/book-covers/gt1.jpg',
      authors: ['Doan Cong Dinh'], genres: ['Math'], publishers: ['Bach Khoa Publishing'],
    },
    {
      title: 'Calculus II',
      description: 'Multivariable functions, partial derivatives, and multiple integrals for engineering students.',
      previewUrl: '/book-covers/gt2.jpg',
      authors: ['Tran Thi Kim Oanh'], genres: ['Math'], publishers: ['Bach Khoa Publishing'],
    },
    {
      title: 'Calculus III',
      description: 'Infinite series and differential equations for engineering students.',
      previewUrl: '/book-covers/gt3.jpg',
      authors: ['Nguyen Thieu Huy'], genres: ['Math'], publishers: ['Bach Khoa Publishing'],
    },
    {
      title: 'Probability & Statistics',
      description: 'Probability theory, statistical methods, and experimental planning for engineering applications.',
      previewUrl: '/book-covers/xstk.jpg',
      authors: ['Bui Minh Tri'], genres: ['Math'], publishers: ['Bach Khoa Publishing'],
    },
    {
      title: 'Bui Cong Minh',
      description: 'Hello my name is Bui Cong Minh, B U I C O N G M I N H',
      previewUrl: '/book-covers/bcm.webp',
      authors: ['Bui Cong Minh'], genres: ['Fiction'], publishers: ['Bui Cong Minh Publishing'],
    },
    {
      title: 'Ký giả người Tày',
      description: '120 Yên Lãng',
      previewUrl: '/book-covers/domixi.webp',
      authors: ['Phung Thanh Do'], genres: ['Politics'], publishers: ['Phung Thanh Do Publishing'],
    },
    {
      title: 'Mai Van Nhat Minh - young talent',
      description: 'mvnm siu cap beo',
      previewUrl: '/book-covers/mvnm.jpg',
      authors: ['Bui Cong Minh'], genres: ['Fiction'], publishers: ['Bui Cong Minh Publishing'],
    },
    // ── Physics books ──
    {
      title: 'Physics I',
      description: 'General physics covering mechanics and thermodynamics for technical university students.',
      previewUrl: '/book-covers/vldc1.jpg',
      authors: ['Luong Duyen Binh'], genres: ['Physics'], publishers: ['Vietnam Education Publishing House'],
    },
    {
      title: 'Physics II',
      description: 'General physics covering electricity, oscillations, and waves for technical university students.',
      previewUrl: '/book-covers/vldc2.webp',
      authors: ['Luong Duyen Binh'], genres: ['Physics'], publishers: ['Vietnam Education Publishing House'],
    },
    {
      title: 'Physics III',
      description: 'General physics covering optics, atomic and nuclear physics for technical university students.',
      previewUrl: '/book-covers/vldc3.jpg',
      authors: ['Luong Duyen Binh'], genres: ['Physics'], publishers: ['Vietnam Education Publishing House'],
    },
    // ── IT books ──
    {
      title: 'Applied Cryptography',
      description: 'A graduate course in applied cryptography covering modern cryptographic protocols and security.',
      previewUrl: '/book-covers/applied-crypto.jpg',
      authors: ['Dan Boneh', 'Victor Shoup'], genres: ['IT'], publishers: ['Self Published'],
    },
    {
      title: 'Machine Learning',
      description: 'Machine learning from an algorithmic perspective, covering neural networks, SVMs, and more.',
      previewUrl: '/book-covers/ml.jpg',
      authors: ['Stephen Marsland'], genres: ['IT'], publishers: ['CRC Press'],
    },
    {
      title: 'Deep Learning in Computer Vision',
      description: 'Principles and applications of deep learning in computer vision tasks.',
      previewUrl: '/book-covers/dl.png',
      authors: ['Mahmoud Hassaballah', 'Ali Ismail Awad'], genres: ['IT'], publishers: ['CRC Press'],
    },
  ];

  const bookIds = {};
  for (const b of bookDefs) {
    const payload = {
      title:        b.title,
      description:  b.description,
      previewUrl:   b.previewUrl,
      authorIds:    b.authors.map(n => author[n]),
      genreIds:     b.genres.map(n => genre[n]),
      publisherIds: b.publishers.map(n => publisher[n]),
    };
    bookIds[b.title] = await req('POST', '/books', payload);
    console.log(`  + book: ${b.title}`);
  }

  // ── 6. Sample reader ──────────────────────────────────────────────────────
  console.log('\nCreating sample reader...');
  let readerId = null;
  try {
    readerId = await req('POST', '/readers', {
      address: '123 Library Lane',
      user: {
        username:    'reader1',
        email:       'reader@test.com',
        password:    'reader123',
        gender:      'Male',
        phoneNumber: null,
        role:        'Reader',
        status:      'Active',
      },
    });
    console.log('  + reader: reader@test.com / reader123');
  } catch (e) {
    console.log('  Skipped sample reader (may already exist):', e.message);
  }

  // ── 7. Sample borrow record + reading card ────────────────────────────────
  if (readerId) {
    try {
      await req('POST', '/borrow-records', {
        quantity:   1,
        borrowDate: plusDays(-7),
        dueDate:    plusDays(23),
        readerId,
        bookId:     bookIds['1984'],
      });
      console.log('  + borrow record for 1984');
    } catch (e) { console.log('  Skipped borrow record:', e.message); }

    try {
      await req('POST', '/reading-cards', {
        label:          'Standard Membership',
        type:           'Normal',
        activationDate: iso(today),
        expiryDate:     plusDays(365),
        readerId,
      });
      console.log('  + reading card for reader1');
    } catch (e) { console.log('  Skipped reading card:', e.message); }
  }

  console.log('\n✅ All done! Data seeded:');
  console.log('   Admin:  test@test.com / test');
  console.log('   Reader: reader@test.com / reader123');
  console.log(`   Books:  ${Object.keys(bookIds).length} books created`);
  console.log('\n   Refresh the app to see the data.');
}

main().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});