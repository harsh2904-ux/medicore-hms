-- V4: Clinical Encounters, Vitals, Notes, Diagnoses, Prescriptions

CREATE TABLE IF NOT EXISTS encounters (
    id BIGSERIAL PRIMARY KEY,
    encounter_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id BIGINT REFERENCES appointments(id) ON DELETE SET NULL,
    encounter_type VARCHAR(50) DEFAULT 'OPD',
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    chief_complaint TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vital_signs (
    id BIGSERIAL PRIMARY KEY,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    temperature NUMERIC(5,2),
    systolic_bp INT,
    diastolic_bp INT,
    heart_rate INT,
    respiratory_rate INT,
    oxygen_saturation NUMERIC(5,2),
    weight NUMERIC(6,2),
    height NUMERIC(5,2),
    bmi NUMERIC(5,2),
    recorded_by VARCHAR(100),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_notes (
    id BIGSERIAL PRIMARY KEY,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    note_type VARCHAR(50) DEFAULT 'SOAP',
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS diagnoses (
    id BIGSERIAL PRIMARY KEY,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    icd10_code VARCHAR(50),
    description VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'PRIMARY',
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    diagnosed_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGSERIAL PRIMARY KEY,
    prescription_number VARCHAR(50) NOT NULL UNIQUE,
    encounter_id BIGINT REFERENCES encounters(id) ON DELETE SET NULL,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    instructions TEXT,
    prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    route VARCHAR(50) DEFAULT 'ORAL',
    instructions TEXT
);

CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_vitals_patient ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
