-- schema.sql
CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  counters_available INT DEFAULT 1,
  avg_service_time INT DEFAULT 10,
  slot_split VARCHAR(50) DEFAULT '1:2:1',
  express_lane_enabled BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS staff (
  staff_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department_id INT REFERENCES departments(department_id),
  availability_status VARCHAR(50) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS slots (
  slot_id SERIAL PRIMARY KEY,
  department_id INT REFERENCES departments(department_id),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  release_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tokens (
  token_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  reason_for_visit TEXT,
  department_id INT REFERENCES departments(department_id),
  queue_type VARCHAR(50) NOT NULL CHECK (queue_type IN ('emergency', 'online', 'walkin')),
  service_type VARCHAR(50),
  expected_duration INT,
  effective_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'in_service', 'completed', 'no_show')),
  registered_by VARCHAR(50) DEFAULT 'visitor',
  display_token VARCHAR(50)
);

-- Insert some dummy data for testing
INSERT INTO departments (name, counters_available, avg_service_time) VALUES 
('Passport Desk', 3, 15),
('Records', 2, 10),
('Licensing', 4, 20)
ON CONFLICT DO NOTHING;
