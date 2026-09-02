const Database = require('better-sqlite3');
const db = new Database('pondok.db');

// Buat tabel users kalau belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'tenaga_pendidik', 'tenaga_kependidikan', 'wali_siswa', 'siswa'))
  )
`);

module.exports = db;