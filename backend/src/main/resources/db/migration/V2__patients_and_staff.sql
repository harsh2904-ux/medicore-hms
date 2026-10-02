-- V2: Patients, Staff, Doctors, Wards, Rooms and Beds

CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    staff_code VARCHAR(50) NOT NULL UNIQUE,
    job_title VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'FULL_TIME',
    qualification VARCHAR(255),
    joining_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    doctor_code VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    consultation_fee NUMERIC(10, 2) DEFAULT 100.00,
    room_number VARCHAR(50),
    available_days VARCHAR(100) DEFAULT 'MON,TUE,WED,THU,FRI',
    shift_start TIME DEFAULT '09:00:00',
    shift_end TIME DEFAULT '17:00:00',
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group VARCHAR(10),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    city VARCHAR(100),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(50),
    insurance_provider VARCHAR(150),
    insurance_policy_number VARCHAR(100),
    allergies TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wards (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    ward_type VARCHAR(50) DEFAULT 'GENERAL',
    floor VARCHAR(20),
    total_beds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id BIGSERIAL PRIMARY KEY,
    ward_id BIGINT REFERENCES wards(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) DEFAULT 'STANDARD',
    daily_rate NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);

CREATE TABLE IF NOT EXISTS beds (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    ward_id BIGINT REFERENCES wards(id) ON DELETE CASCADE,
    bed_number VARCHAR(50) NOT NULL,
    bed_type VARCHAR(50) DEFAULT 'STANDARD',
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    daily_charge NUMERIC(10, 2) DEFAULT 150.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_doctors_dept ON doctors(department_id);
CREATE INDEX IF NOT EXISTS idx_doctors_code ON doctors(doctor_code);
