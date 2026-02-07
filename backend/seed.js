const { Pool } = require('pg');

const pool = new Pool({
  user: 'krishnapoojitha',
  host: 'localhost',
  database: 'transparent_queue',
  password: '5669', 
  port: 5432,
});

const seedDatabase = async () => {
  try {
    console.log(" Starting Database Seeding...");

    // 1. Drop existing tables to start fresh (Clean Slate)
    await pool.query('DROP TABLE IF EXISTS queue_tokens CASCADE;');
    await pool.query('DROP TABLE IF EXISTS service_requirements CASCADE;');
    await pool.query('DROP TABLE IF EXISTS services CASCADE;');
    await pool.query('DROP TABLE IF EXISTS counters CASCADE;');
    await pool.query('DROP TABLE IF EXISTS staff CASCADE;');


    // 2. Create Services Table
    await pool.query(`
      CREATE TABLE services (
        service_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        base_priority INTEGER NOT NULL,
        channel_type VARCHAR(20),
        avg_duration_mins INTEGER
      );
    `);

    // 3. Create Queue Tokens Table
    await pool.query(`
      CREATE TABLE queue_tokens (
        token_id SERIAL PRIMARY KEY,
        token_number VARCHAR(10),
        visitor_name VARCHAR(100),
         visitor_phonenumber VARCHAR(20) NOT NULL,
        service_id INTEGER REFERENCES services(service_id),
        status VARCHAR(20) DEFAULT 'pending',
        is_offline BOOLEAN DEFAULT false,
        latitude DECIMAL,
        longitude DECIMAL,
        entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
     CREATE TABLE staff (
     staff_id SERIAL PRIMARY KEY,
     email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL,
     service_id INT REFERENCES services(service_id)
      );

    `);
    

    // 4. Insert Service Types (The "Brains" of the priority system)
    // Quick Approval = High Priority (20), Long Consult = Base Priority (0)
    await pool.query(`
      INSERT INTO services (name, base_priority, channel_type, avg_duration_mins) VALUES 
      ('Quick Approval', 20, 'express', 5),
      ('Normal Consultation', 10, 'general', 15),
      ('Longer Consultation', 0, 'general', 30);
    `);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();