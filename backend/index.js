// --- PERSON B: IMPORTS & SETUP ---
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { pool } = require('./server'); // Importing Person A's DB connection

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// --- PERSON B: SOCKET.IO CONNECTION HANDLING ---
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // You can handle "Rooms" here so visitors only get relevant alerts
    socket.on('join_department', (deptId) => {
        socket.join(deptId);
        console.log(`User joined room: ${deptId}`);

    });
});

// --- PERSON B: API ENDPOINTS (The "Doors") ---

// 1. The Registration Door
app.post('/api/register', async (req, res) => {
    try {
        // Here you use Person A's logic to save to DB
        const newVisitor = await pool.query("INSERT INTO..."); 
        
        // YOUR JOB: Shout to everyone that the queue changed
        io.emit('queue_updated'); 
        
        res.status(201).json(newVisitor);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 2. The Staff "Next" Door
app.post('/api/next', async (req, res) => {
    try {
        // Here you use Person A's logic to find the fairest next person
        const nextPerson = await pool.query("SELECT..."); 

        // YOUR JOB: Shout to the specific user/room that it's their turn
        io.emit('token_called', { 
            token: nextPerson.token_number, 
           // counter: req.body.counter_id 
        });

        res.json(nextPerson);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- START THE SERVER ---
server.listen(5000, () => {
    console.log('Backend running on port 5000');
});