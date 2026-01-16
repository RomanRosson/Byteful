import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'byteful.db');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('link', 'command', 'site')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_timestamp 
  AFTER UPDATE ON items
  BEGIN
    UPDATE items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

// Initialize default admin if not exists
const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin').get();
if (adminExists.count === 0) {
  db.prepare('INSERT INTO admin (username, pin) VALUES (?, ?)').run('admin', '1234');
  console.log('Default admin created: username="admin", pin="1234"');
}

// API Routes

// Get all items
app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create item
app.post('/api/items', (req, res) => {
  try {
    const { type, title, content, description, category, tags } = req.body;
    const result = db
      .prepare('INSERT INTO items (type, title, content, description, category, tags) VALUES (?, ?, ?, ?, ?, ?)')
      .run(type, title, content, description || null, category || null, tags || null);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
app.put('/api/items/:id', (req, res) => {
  try {
    const { type, title, content, description, category, tags } = req.body;
    db.prepare(
      'UPDATE items SET type = ?, title = ?, content = ?, description = ?, category = ?, tags = ? WHERE id = ?'
    ).run(type, title, content, description || null, category || null, tags || null, req.params.id);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search items
app.get('/api/items/search/:query', (req, res) => {
  try {
    const searchTerm = `%${req.params.query}%`;
    const items = db
      .prepare(
        'SELECT * FROM items WHERE title LIKE ? OR content LIKE ? OR description LIKE ? OR category LIKE ? OR tags LIKE ? ORDER BY created_at DESC'
      )
      .all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get items by type
app.get('/api/items/type/:type', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items WHERE type = ? ORDER BY created_at DESC').all(req.params.type);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin authentication
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, pin } = req.body;
    const admin = db.prepare('SELECT * FROM admin WHERE username = ? AND pin = ?').get(username, pin);
    if (admin) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
