const db = require('./database');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Supaya server bisa "menyajikan" file HTML, CSS, JS yang sudah kamu buat
app.use(express.static(__dirname));

// Supaya server bisa membaca data JSON yang dikirim dari frontend (misal saat login)
app.use(express.json());

// Halaman utama otomatis buka index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ENDPOINT: Daftar akun baru
app.post('/api/register', async (req, res) => {
  const { nama, email, password, role } = req.body;

  if (!nama || !email || !password || !role) {
    return res.status(400).json({ error: 'Semua data harus diisi' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)');
    stmt.run(nama, email, hashedPassword, role);
    res.json({ message: 'Akun berhasil didaftarkan' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email sudah terdaftar' });
    } else {
      res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  }
});

// ENDPOINT: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  const passwordCocok = await bcrypt.compare(password, user.password);

  if (!passwordCocok) {
    return res.status(401).json({ error: 'Email atau password salah' });
  }

  res.json({
    message: 'Login berhasil',
    user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
  });
});
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});