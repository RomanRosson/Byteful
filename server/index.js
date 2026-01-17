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
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    pin TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_timestamp 
  AFTER UPDATE ON items
  BEGIN
    UPDATE items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

// Migrate existing types from items to types table
try {
  const existingTypes = db.prepare('SELECT DISTINCT type FROM items WHERE type IS NOT NULL').all();
  existingTypes.forEach((row) => {
    try {
      db.prepare('INSERT OR IGNORE INTO types (name) VALUES (?)').run(row.type);
    } catch (error) {
      // Type already exists, ignore
    }
  });
} catch (error) {
  // Migration failed, continue
  console.log('Type migration skipped or completed');
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

// Get unique item types (must come before /api/items/:id to avoid route conflict)
app.get('/api/items/types', (req, res) => {
  try {
    const types = db.prepare('SELECT name FROM types ORDER BY name').all();
    res.json(types.map(row => row.name));
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
    const { type, title, content, description } = req.body;
    
    // Validate required fields
    if (!type || !type.trim()) {
      return res.status(400).json({ error: 'Type is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = db
      .prepare('INSERT INTO items (type, title, content, description) VALUES (?, ?, ?, ?)')
      .run(type.trim(), title.trim(), content.trim(), description?.trim() || null);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update item
app.put('/api/items/:id', (req, res) => {
  try {
    const { type, title, content, description } = req.body;
    
    // Validate required fields
    if (!type || !type.trim()) {
      return res.status(400).json({ error: 'Type is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = db.prepare(
      'UPDATE items SET type = ?, title = ?, content = ?, description = ? WHERE id = ?'
    ).run(type.trim(), title.trim(), content.trim(), description?.trim() || null, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
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
        'SELECT * FROM items WHERE title LIKE ? OR content LIKE ? OR description LIKE ? ORDER BY created_at DESC'
      )
      .all(searchTerm, searchTerm, searchTerm);
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

// Type management endpoints
// Create type
app.post('/api/types', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Type name is required' });
    }
    const typeName = name.trim();
    // Check for case-insensitive duplicate
    const existing = db.prepare('SELECT * FROM types WHERE LOWER(name) = LOWER(?)').get(typeName);
    if (existing) {
      return res.status(409).json({ error: 'Type already exists' });
    }
    const result = db.prepare('INSERT INTO types (name) VALUES (?)').run(typeName);
    const type = db.prepare('SELECT * FROM types WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(type);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Type already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update type (rename)
app.put('/api/types/:id', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Type name is required' });
    }
    const typeName = name.trim();
    const oldType = db.prepare('SELECT * FROM types WHERE id = ?').get(req.params.id);
    if (!oldType) {
      return res.status(404).json({ error: 'Type not found' });
    }
    
    // Check for case-insensitive duplicate (excluding current type)
    const existing = db.prepare('SELECT * FROM types WHERE LOWER(name) = LOWER(?) AND id != ?').get(typeName, req.params.id);
    if (existing) {
      return res.status(409).json({ error: 'Type name already exists' });
    }
    
    // Update type name in types table
    db.prepare('UPDATE types SET name = ? WHERE id = ?').run(typeName, req.params.id);
    
    // Update all items with the old type to use the new type
    db.prepare('UPDATE items SET type = ? WHERE type = ?').run(typeName, oldType.name);
    
    const updatedType = db.prepare('SELECT * FROM types WHERE id = ?').get(req.params.id);
    res.json(updatedType);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Type name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete type
app.delete('/api/types/:id', (req, res) => {
  try {
    const type = db.prepare('SELECT * FROM types WHERE id = ?').get(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Type not found' });
    }
    
    // Check if any items use this type
    const itemsWithType = db.prepare('SELECT COUNT(*) as count FROM items WHERE type = ?').get(type.name);
    if (itemsWithType.count > 0) {
      return res.status(400).json({ error: `Cannot delete type. ${itemsWithType.count} item(s) are using this type.` });
    }
    
    db.prepare('DELETE FROM types WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all types with details
app.get('/api/types', (req, res) => {
  try {
    const types = db.prepare(`
      SELECT t.*, COUNT(i.id) as item_count 
      FROM types t 
      LEFT JOIN items i ON t.name = i.type 
      GROUP BY t.id 
      ORDER BY t.name
    `).all();
    res.json(types);
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
