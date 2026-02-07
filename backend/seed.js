// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'transparent_queue',
//   password: 'Ire@1234', 
//   port: 5432,
// });

// const seedDatabase = async () => {
//   try {
//     console.log(" Starting Database Seeding...");

//     // 1. Drop existing tables to start fresh (Clean Slate)
//     await pool.query('DROP TABLE IF EXISTS queue_tokens CASCADE;');
//     await pool.query('DROP TABLE IF EXISTS service_requirements CASCADE;');
//     await pool.query('DROP TABLE IF EXISTS services CASCADE;');
//     await pool.query('DROP TABLE IF EXISTS counters CASCADE;');

//     // 2. Create Services Table
//     await pool.query(`
//       CREATE TABLE services (
//         service_id SERIAL PRIMARY KEY,
//         name VARCHAR(50) NOT NULL,
//         base_priority INTEGER NOT NULL,
//         channel_type VARCHAR(20),
//         avg_duration_mins INTEGER
//       );
//     `);

//     // 3. Create Queue Tokens Table
//     await pool.query(`
//       CREATE TABLE queue_tokens (
//         token_id SERIAL PRIMARY KEY,
//         token_number VARCHAR(10),
//         visitor_name VARCHAR(100),
//          visitor_phonenumber VARCHAR(20) NOT NULL,
//         service_id INTEGER REFERENCES services(service_id),
//         status VARCHAR(20) DEFAULT 'pending',
//         is_offline BOOLEAN DEFAULT false,
//         latitude DECIMAL,
//         longitude DECIMAL,
//         entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     await pool.query(`
//      CREATE TABLE staff (
//      staff_id SERIAL PRIMARY KEY,
//      email VARCHAR(100) UNIQUE NOT NULL,
//       password VARCHAR(200) NOT NULL,
//      service_id INT REFERENCES services(service_id)
//       );

//     `);
    

//     // 4. Insert Service Types (The "Brains" of the priority system)
//     // Quick Approval = High Priority (20), Long Consult = Base Priority (0)
//     await pool.query(`
//       INSERT INTO services (name, base_priority, channel_type, avg_duration_mins) VALUES 
//       ('Quick Approval', 20, 'express', 5),
//       ('Normal Consultation', 10, 'general', 15),
//       ('Longer Consultation', 0, 'general', 30);
//     `);

//     console.log("Database seeded successfully!");
//     process.exit();
//   } catch (err) {
//     console.error("Error seeding database:", err);
//     process.exit(1);
//   }
// };

// seedDatabase();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'transparent_queue',
  password: 'Ire@1234',
  port: 5432,
});

const seedDatabase = async () => {
  try {
    console.log("Starting Database Seeding...");

    // 1️⃣ Drop existing tables in reverse dependency order
    await pool.query('DROP TABLE IF EXISTS queue_tokens CASCADE;');
    await pool.query('DROP TABLE IF EXISTS staff CASCADE;');
    await pool.query('DROP TABLE IF EXISTS service_requirements CASCADE;'); // optional, keep if exists
    await pool.query('DROP TABLE IF EXISTS services CASCADE;');
    await pool.query('DROP TABLE IF EXISTS counters CASCADE;');

    // 2️⃣ Create Services Table
    await pool.query(`
      CREATE TABLE services (
        service_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        base_priority INTEGER NOT NULL,
        channel_type VARCHAR(20),
        avg_duration_mins INTEGER
      );
    `);

    // 3️⃣ Create Queue Tokens Table
    await pool.query(`
      CREATE TABLE queue_tokens (
        token_id SERIAL PRIMARY KEY,
        token_number VARCHAR(10),
        visitor_name VARCHAR(100),
        visitor_phonenumber VARCHAR(20) NOT NULL,
        service_id INTEGER NOT NULL REFERENCES services(service_id),
        status VARCHAR(20) DEFAULT 'pending',
        is_offline BOOLEAN DEFAULT false,
        latitude DECIMAL,
        longitude DECIMAL,
        entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4️⃣ Create Staff Table
    await pool.query(`
      CREATE TABLE staff (
        staff_id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        service_id INT NOT NULL REFERENCES services(service_id)
      );
    `);

    // 5️⃣ Insert Service Types
    const servicesResult = await pool.query(`
      INSERT INTO services (name, base_priority, channel_type, avg_duration_mins) VALUES 
      ('Quick Approval', 20, 'express', 5),
      ('Normal Consultation', 10, 'general', 15),
      ('Longer Consultation', 0, 'general', 30)
      RETURNING service_id;
    `);

    const [quickApproval, normalConsult, longConsult] = servicesResult.rows.map(row => row.service_id);

    // 6️⃣ Insert Staff
    await pool.query(`
      INSERT INTO staff (email, password, service_id) VALUES
      ('alice@example.com', 'password123', $1),
      ('bob@example.com', 'password123', $2),
      ('carol@example.com', 'password123', $3);
    `, [quickApproval, normalConsult, longConsult]);

    // 7️⃣ Insert Queue Tokens
    await pool.query(`
      INSERT INTO queue_tokens (token_number, visitor_name, visitor_phonenumber, service_id, status) VALUES
      ('T001', 'John Doe', '9998887777', $1, 'pending'),
      ('T002', 'Jane Smith', '8887776666', $2, 'pending'),
      ('T003', 'Alice Brown', '7776665555', $3, 'pending');
    `, [quickApproval, normalConsult, longConsult]);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();