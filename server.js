// server.js
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Local SQLite Database file
let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create local tables matching Preply's setup
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    );
    CREATE TABLE IF NOT EXISTS tutors (
      id TEXT PRIMARY KEY,
      name TEXT,
      rate REAL,
      subjects TEXT
    );
  `);
  console.log("Local SQLite database initialized inside database.sqlite");
})();

// Endpoint: Local Register Auth Route
app.post('/api/auth/register', async (req, res) => {
  const { id, email, password, role } = req.body;
  try {
    await db.run('INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)', [id, email, password, role]);
    res.status(201).json({ success: true, message: "User registered locally!" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists locally." });
  }
});

// Endpoint: Fetch Tutors Locally
app.get('/api/tutors', async (req, res) => {
  const tutors = await db.all('SELECT * FROM tutors');
  res.json(tutors);
});

app.listen(5000, () => console.log('Local Tutor Server running on http://localhost:5000'));
