import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

async function generateDisplayToken(department_id) {
  const deptRes = await db.query('SELECT name FROM departments WHERE department_id = $1', [department_id]);
  if (deptRes.rows.length === 0) return 'T1';
  const deptName = deptRes.rows[0].name;
  const prefix = deptName.charAt(0).toUpperCase();
  const countRes = await db.query('SELECT count(*) FROM tokens WHERE department_id = $1', [department_id]);
  const nextNum = parseInt(countRes.rows[0].count) + 1;
  return `${prefix}${nextNum}`;
}

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM departments ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Book Online Appointment
app.post('/api/book', async (req, res) => {
  const { name, age, reason, department_id, service_type } = req.body;
  const expected_duration = service_type === 'quick approval' ? 5 : 20;

  try {
    const display_token = await generateDisplayToken(department_id);
    const result = await db.query(
      `INSERT INTO tokens (name, age, reason_for_visit, department_id, queue_type, service_type, expected_duration, registered_by, display_token) 
       VALUES ($1, $2, $3, $4, 'online', $5, $6, 'visitor', $7) RETURNING *`,
      [name, age, reason, department_id, service_type, expected_duration, display_token]
    );
    io.emit('queueUpdated', { department_id });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Add Walk-in
app.post('/api/walkin', async (req, res) => {
  const { name, age, reason, department_id, service_type, queue_type } = req.body;
  const expected_duration = service_type === 'quick approval' ? 5 : 20;

  try {
    const display_token = await generateDisplayToken(department_id);
    const result = await db.query(
      `INSERT INTO tokens (name, age, reason_for_visit, department_id, queue_type, service_type, expected_duration, registered_by, display_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'staff', $8) RETURNING *`,
      [name, age, reason, department_id, queue_type || 'walkin', service_type, expected_duration, display_token]
    );
    io.emit('queueUpdated', { department_id });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add walkin' });
  }
});

// Get Active Queue for a department
app.get('/api/queue/:department_id', async (req, res) => {
  const { department_id } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM tokens WHERE department_id = $1 AND status = 'waiting' ORDER BY effective_time ASC`,
      [department_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// Get Token Status
app.get('/api/status/:token_id', async (req, res) => {
  const { token_id } = req.params;
  try {
    const tokenResult = await db.query('SELECT * FROM tokens WHERE token_id = $1', [token_id]);
    if (tokenResult.rows.length === 0) return res.status(404).json({ error: 'Token not found' });
    
    const token = tokenResult.rows[0];
    
    // Count people ahead and calculate wait time based on dispatch logic
    // simplified version: sum of expected_duration of waiting tokens in same dept created before this one
    // But with emergency priority considered
    const aheadResult = await db.query(
      `SELECT sum(expected_duration) as total_wait, count(*) as people_ahead 
       FROM tokens 
       WHERE department_id = $1 AND status = 'waiting' 
       AND (queue_type = 'emergency' OR effective_time < $2)
       AND token_id != $3`,
      [token.department_id, token.effective_time, token.token_id]
    );
    
    res.json({ 
      token, 
      people_ahead: parseInt(aheadResult.rows[0].people_ahead) || 0,
      estimated_wait_mins: parseInt(aheadResult.rows[0].total_wait) || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Call Next (Dispatch logic)
app.post('/api/next/:department_id', async (req, res) => {
  const { department_id } = req.params;
  
  try {
    // 1. Check emergency first
    let result = await db.query(
      `SELECT token_id FROM tokens WHERE department_id = $1 AND status = 'waiting' AND queue_type = 'emergency' ORDER BY effective_time ASC LIMIT 1`,
      [department_id]
    );
    
    // 2. Otherwise get earliest effective_time (ignoring slots logic for simple MVP)
    if (result.rows.length === 0) {
      result = await db.query(
        `SELECT token_id FROM tokens WHERE department_id = $1 AND status = 'waiting' ORDER BY effective_time ASC LIMIT 1`,
        [department_id]
      );
    }
    
    if (result.rows.length > 0) {
      const nextTokenId = result.rows[0].token_id;
      const updated = await db.query(
        `UPDATE tokens SET status = 'called' WHERE token_id = $1 RETURNING *`,
        [nextTokenId]
      );
      io.emit('queueUpdated', { department_id });
      res.json(updated.rows[0]);
    } else {
      res.json({ message: 'No one is waiting.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to call next' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
