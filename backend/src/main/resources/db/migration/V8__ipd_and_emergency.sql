-- V8: IPD Admissions, Nursing Notes, Emergency Triage

CREATE TABLE IF NOT EXISTS admissions (
    id BIGSERIAL PRIMARY KEY,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    attending_doctor_id BIGINT REFERENCES doctors(id) ON DELETE SET NULL,
    bed_id BIGINT REFERENCES beds(id) ON DELETE SET NULL,
    admission_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMP WITH TIME ZONE,
    admission_type VARCHAR(50) DEFAULT 'ELECTIVE',
    status VARCHAR(50) DEFAULT 'ADMITTED',
    reason TEXT,
    discharge_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nursing_notes (
    id BIGSERIAL PRIMARY KEY,
    admission_id BIGINT REFERENCES admissions(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    nurse_name VARCHAR(100) NOT NULL,
    shift VARCHAR(20) DEFAULT 'DAY',
    note TEXT NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_triages (
    id BIGSERIAL PRIMARY KEY,
    triage_number VARCHAR(50) NOT NULL UNIQUE,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    triage_level VARCHAR(20) NOT NULL,
    chief_complaint TEXT NOT NULL,
    vitals_summary TEXT,
    status VARCHAR(50) DEFAULT 'TRIAGED',
    arrived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admissions_patient ON admissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_admissions_bed ON admissions(bed_id);
