-- V5: Laboratory and Radiology Orders & Results

CREATE TABLE IF NOT EXISTS lab_tests (
    id BIGSERIAL PRIMARY KEY,
    test_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sample_type VARCHAR(100),
    turnaround_time_hours INT DEFAULT 24,
    standard_rate NUMERIC(10,2) DEFAULT 50.00,
    normal_range TEXT,
    unit VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS lab_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    priority VARCHAR(20) DEFAULT 'ROUTINE',
    status VARCHAR(50) DEFAULT 'ORDERED',
    clinical_notes TEXT,
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_results (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES lab_orders(id) ON DELETE CASCADE,
    test_id BIGINT REFERENCES lab_tests(id) ON DELETE CASCADE,
    result_value VARCHAR(255),
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    flag VARCHAR(20) DEFAULT 'NORMAL',
    technician_notes TEXT,
    verified_by VARCHAR(100),
    result_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS radiology_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    modality VARCHAR(50) NOT NULL,
    body_part VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'ROUTINE',
    status VARCHAR(50) DEFAULT 'ORDERED',
    findings TEXT,
    impression TEXT,
    radiologist_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lab_orders_patient ON lab_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_rad_orders_patient ON radiology_orders(patient_id);
