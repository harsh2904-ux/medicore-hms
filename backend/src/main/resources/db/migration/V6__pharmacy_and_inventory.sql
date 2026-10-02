-- V6: Pharmacy & Inventory

CREATE TABLE IF NOT EXISTS medicines (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    category VARCHAR(100),
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    manufacturer VARCHAR(150),
    unit_price NUMERIC(10,2) DEFAULT 10.00,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 100,
    reorder_level INT DEFAULT 20,
    unit VARCHAR(50) DEFAULT 'Units',
    unit_price NUMERIC(10,2) DEFAULT 15.00,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'IN_STOCK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pharmacy_dispensations (
    id BIGSERIAL PRIMARY KEY,
    dispense_number VARCHAR(50) NOT NULL UNIQUE,
    prescription_id BIGINT REFERENCES prescriptions(id) ON DELETE SET NULL,
    patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    dispensed_by VARCHAR(100),
    status VARCHAR(50) DEFAULT 'DISPENSED',
    total_amount NUMERIC(10,2) DEFAULT 0.00,
    dispensed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_code ON inventory_items(item_code);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
