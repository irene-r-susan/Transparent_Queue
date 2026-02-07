// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const { Pool } = require('pg');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(cors());
// app.use(express.json());

// // 1. DATABASE CONNECTION
// const pool = new Pool({
//   user: 'krishnapoojitha',
//   host: 'localhost',
//   database: 'transparent_queue',
//   password: '5669',
//   port: 5432,
// });

// pool.connect()
//   .then(() => console.log("✅ PostgreSQL Connected"))
//   .catch(err => console.error("❌ DB Error:", err));

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);
  
//     socket.on("join_department", (deptId) => {
//       socket.join(deptId);
//       console.log(`Joined room: ${deptId}`);
//     });
//   });

// // 2. THE FAIRNESS CALCULATION (Weighted Aging)
// // This ensures "Long" consultations aren't ignored for "Quick" ones.
// const getFairnessScoreQuery = `
//   SELECT q.token_id, q.token_number, s.name as service_name
//   FROM queue_tokens q
//   JOIN services s ON q.service_id = s.service_id
//   WHERE q.status = 'active' 
//   AND (s.channel_type = $1 OR q.is_offline = true)
//   ORDER BY (s.base_priority + EXTRACT(EPOCH FROM (NOW() - q.entry_time)) / 60) DESC
//   LIMIT 1
// `;

// // 3. API: REGISTER A NEW TOKEN
// app.post('/api/token/register', async (req, res) => {
//   const { name, service_id, is_offline, lat, lng } = req.body;
//   try {
//     const tokenPrefix = is_offline ? 'W' : 'O'; // W for Walk-in, O for Online
//     const tokenNum = `${tokenPrefix}-${Math.floor(100 + Math.random() * 900)}`;


//     const result = await pool.query(
//       `INSERT INTO queue_tokens (visitor_name, service_id, token_number, is_offline, status, latitude, longitude) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [name, service_id, tokenNum, is_offline, is_offline ? 'active' : 'pending', lat, lng]
//     );

//     io.emit('queue_updated'); // Update the public display and all phones
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 4. API: GEOFENCE ACTIVATION (Arriving at the Office)
// app.post('/api/tokens/activate', async (req, res) => {
//   const { token_id } = req.body;
//   try {
//     await pool.query("UPDATE queue_tokens SET status = 'active' WHERE token_id = $1", [token_id]);
//     io.emit('queue_updated');
//     res.json({ message: "Welcome! You are now physically in the queue." });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 5. API: STAFF 'CALL NEXT' BUTTON
// app.post('/api/staff/next', async (req,res)=>{
//   const { service_id, counter_id } = req.body;

//   try{

//     const next = await pool.query(`
//       SELECT q.token_id, q.token_number, s.name as service_name
//       FROM queue_tokens q
//       JOIN services s ON q.service_id=s.service_id
//       WHERE q.status='active'
//       AND q.service_id=$1
//       ORDER BY
//         (s.base_priority +
//         EXTRACT(EPOCH FROM (NOW()-q.entry_time))/60) DESC
//       LIMIT 1
//     `,[service_id]);

//     if(next.rows.length===0){
//       return res.status(404).json({message:"No patients waiting"});
//     }

//     const patient = next.rows[0];
//     await pool.query(
//       "UPDATE queue_tokens SET status='done' WHERE token_id=$1",
//       [patient.token_id]
//     );

//     io.emit('token_called',{
//       token: patient.token_number,
//       //counter: counter_id,
//       service: patient.service_name
//     });

//     res.json(patient);

//   }catch(err){
//     res.status(500).json({error:err.message});
//   }
// });


// // 6. REAL-TIME SERVER START
// const PORT = 5050;
// server.listen(PORT, () => {
//     console.log(`Pulse Queue Server running on http://localhost:${PORT}`);

// });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "transparent_queue",
  password: "Ire@1234",
  port: 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ DB Error:", err));


/* ---------------- SOCKET ---------------- */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_department", (deptId) => {
    socket.join(deptId);
    console.log(`Joined room: ${deptId}`);
  });
});


/* ---------------- ROUTES ---------------- */

/* Register Token */
app.post("/api/tokens/register", async (req, res) => {
  const { name, phone, service_id, is_offline, lat, lng } = req.body;

  if (!name || !phone || !service_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const prefix = is_offline ? "W" : "O";
    const tokenNum = `${prefix}-${Date.now().toString().slice(-3)}`;

    const result = await pool.query(
      `INSERT INTO queue_tokens
       (visitor_name, visitor_phonenumber, service_id,
        token_number, is_offline, status, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        name,
        phone,
        service_id,
        tokenNum,
        is_offline,
        is_offline ? "active" : "pending",
        lat,
        lng
      ]
    );

    io.emit("queue_updated");

res.status(201).json({
  token_number: result.rows[0].token_number,
  token_id: result.rows[0].token_id
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* Call Next Patient */
app.post("/api/staff/next", async (req, res) => {
  const { service_id } = req.body;

  try {
    const next = await pool.query(
      `SELECT q.token_id, q.token_number, s.name as service_name
       FROM queue_tokens q
       JOIN services s ON q.service_id=s.service_id
       WHERE q.status='active'
       AND q.service_id=$1
       ORDER BY
        (s.base_priority +
        EXTRACT(EPOCH FROM (NOW()-q.entry_time))/60) DESC
       LIMIT 1`,
      [service_id]
    );

    if (next.rows.length === 0)
      return res.status(404).json({ message: "No patients waiting" });

    const patient = next.rows[0];

    await pool.query(
      "UPDATE queue_tokens SET status='done' WHERE token_id=$1",
      [patient.token_id]
    );

    io.emit("token_called", {
      token: patient.token_number,
      service: patient.service_name
    });

    res.json(patient);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------------- START SERVER ---------------- */

const PORT = 5050;
server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
