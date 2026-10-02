-- V10: Seed Data (Roles, Admin/Demo Users, Hospital, Departments, Doctors, Patients, Inventory, Lab Tests)

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Full system administrator'),
(2, 'ROLE_DOCTOR', 'Licensed physician / consultant'),
(3, 'ROLE_NURSE', 'Registered clinical nurse'),
(4, 'ROLE_RECEPTIONIST', 'Front desk and registration staff'),
(5, 'ROLE_PHARMACIST', 'Pharmacy and medication manager'),
(6, 'ROLE_LAB_TECHNICIAN', 'Laboratory and diagnostic technician'),
(7, 'ROLE_BILLING', 'Billing and accounts officer')
ON CONFLICT (id) DO NOTHING;

-- 2. Permissions
INSERT INTO permissions (id, name, description, module) VALUES
(1, 'READ_PATIENTS', 'View patient records', 'PATIENT'),
(2, 'WRITE_PATIENTS', 'Create and edit patient records', 'PATIENT'),
(3, 'READ_APPOINTMENTS', 'View appointments', 'APPOINTMENT'),
(4, 'WRITE_APPOINTMENTS', 'Book and manage appointments', 'APPOINTMENT'),
(5, 'READ_CLINICAL', 'View clinical notes and EMR', 'CLINICAL'),
(6, 'WRITE_CLINICAL', 'Add clinical notes, vitals, prescriptions', 'CLINICAL'),
(7, 'READ_LAB', 'View lab orders and results', 'LAB'),
(8, 'WRITE_LAB', 'Record lab orders and enter results', 'LAB'),
(9, 'READ_PHARMACY', 'View medicines and inventory', 'PHARMACY'),
(10, 'WRITE_PHARMACY', 'Dispense prescriptions and adjust stock', 'PHARMACY'),
(11, 'READ_BILLING', 'View invoices and payments', 'BILLING'),
(12, 'WRITE_BILLING', 'Generate invoices and record payments', 'BILLING'),
(13, 'ADMIN_ACCESS', 'Full administrative and configuration rights', 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Map Admin to all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions
ON CONFLICT DO NOTHING;

-- 3. Hospital and Branch
INSERT INTO hospitals (id, hospital_code, name, legal_name, email, phone, address, city, state, country, postal_code, timezone, status)
VALUES (1, 'MC-MAIN', 'MediCore Central Hospital', 'MediCore Health Enterprises Inc.', 'contact@medicore.com', '+1 (555) 019-2834', '100 Medical Center Way', 'San Francisco', 'CA', 'USA', '94143', 'America/Los_Angeles', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, hospital_id, branch_code, name, address, city, phone, is_main, status)
VALUES (1, 1, 'MC-BR-01', 'Main Campus', '100 Medical Center Way, Suite 100', 'San Francisco', '+1 (555) 019-2834', TRUE, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 4. Departments
INSERT INTO departments (id, branch_id, code, name, description, department_type, status) VALUES
(1, 1, 'CARD', 'Cardiology', 'Heart and cardiovascular care', 'CLINICAL', 'ACTIVE'),
(2, 1, 'NEUR', 'Neurology', 'Brain and nervous system disorders', 'CLINICAL', 'ACTIVE'),
(3, 1, 'PED', 'Pediatrics', 'Comprehensive child healthcare', 'CLINICAL', 'ACTIVE'),
(4, 1, 'ORTHO', 'Orthopedics', 'Musculoskeletal and sports medicine', 'CLINICAL', 'ACTIVE'),
(5, 1, 'EMERG', 'Emergency Medicine', '24/7 Level-1 trauma and acute care', 'EMERGENCY', 'ACTIVE'),
(6, 1, 'GEN', 'General Medicine', 'Primary care and internal medicine', 'CLINICAL', 'ACTIVE'),
(7, 1, 'RAD', 'Radiology & Imaging', 'Diagnostic CT, MRI, X-ray and Ultrasound', 'DIAGNOSTIC', 'ACTIVE'),
(8, 1, 'PATH', 'Pathology & Laboratory', 'Clinical diagnostic and blood testing', 'DIAGNOSTIC', 'ACTIVE'),
(9, 1, 'PHARM', 'Pharmacy', 'Inpatient and outpatient pharmaceuticals', 'PHARMACY', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 5. Users
-- BCrypt hash for 'admin123': $2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te
INSERT INTO users (id, hospital_id, branch_id, username, email, password_hash, first_name, last_name, phone, status) VALUES
(1, 1, 1, 'admin', 'admin@medicore.com', '$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te', 'Alexander', 'Wright', '+1 (555) 010-0001', 'ACTIVE'),
(2, 1, 1, 'doctor', 'doctor@medicore.com', '$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te', 'Sarah', 'Jenkins', '+1 (555) 010-0002', 'ACTIVE'),
(3, 1, 1, 'nurse', 'nurse@medicore.com', '$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te', 'Elena', 'Vance', '+1 (555) 010-0003', 'ACTIVE'),
(4, 1, 1, 'reception', 'reception@medicore.com', '$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te', 'Michael', 'Scott', '+1 (555) 010-0004', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4)
ON CONFLICT DO NOTHING;

-- 6. Doctors
INSERT INTO doctors (id, user_id, department_id, doctor_code, specialization, license_number, consultation_fee, room_number, available_days, shift_start, shift_end, status) VALUES
(1, 2, 1, 'DOC-001', 'Interventional Cardiology', 'CA-MD-98231', 150.00, '301-A', 'MON,TUE,WED,THU,FRI', '08:30:00', '16:30:00', 'AVAILABLE'),
(2, NULL, 2, 'DOC-002', 'Neurology & Stroke Care', 'CA-MD-77412', 175.00, '302-B', 'MON,TUE,WED,THU', '09:00:00', '17:00:00', 'AVAILABLE'),
(3, NULL, 3, 'DOC-003', 'Pediatric Medicine', 'CA-MD-66321', 120.00, '205-C', 'MON,WED,FRI', '09:00:00', '15:00:00', 'AVAILABLE'),
(4, NULL, 4, 'DOC-004', 'Orthopedic Surgery', 'CA-MD-55109', 200.00, '410-A', 'TUE,THU,SAT', '08:00:00', '14:00:00', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- 7. Patients
INSERT INTO patients (id, mrn, first_name, last_name, gender, date_of_birth, blood_group, phone, email, address, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_policy_number, allergies, status) VALUES
(1, 'MC-2026-001', 'Eleanor', 'Vance', 'FEMALE', '1985-04-12', 'A+', '+1 (555) 234-5678', 'eleanor.vance@example.com', '742 Evergreen Terrace', 'San Francisco', 'Eli Vance', '+1 (555) 998-1234', 'Blue Cross Blue Shield', 'BCBS-992384-01', 'Penicillin, Sulfa', 'ACTIVE'),
(2, 'MC-2026-002', 'David', 'Kim', 'MALE', '1978-09-23', 'O+', '+1 (555) 345-6789', 'david.kim@example.com', '1204 Pine Street, Apt 4B', 'San Francisco', 'Sun-Hi Kim', '+1 (555) 887-2345', 'Aetna Health', 'AET-771239-09', 'None known', 'ACTIVE'),
(3, 'MC-2026-003', 'Maria', 'Rodriguez', 'FEMALE', '1992-11-05', 'B+', '+1 (555) 456-7890', 'maria.r@example.com', '88 Mission Bay Blvd', 'San Francisco', 'Carlos Rodriguez', '+1 (555) 776-3456', 'UnitedHealthcare', 'UHC-445566-02', 'Aspirin', 'ACTIVE'),
(4, 'MC-2026-004', 'James', 'Wilson', 'MALE', '1965-02-18', 'AB+', '+1 (555) 567-8901', 'j.wilson@example.com', '500 Howard Street', 'San Francisco', 'Patricia Wilson', '+1 (555) 665-4567', 'Kaiser Permanente', 'KP-112233-04', 'Latex', 'ACTIVE'),
(5, 'MC-2026-005', 'Sophia', 'Patel', 'FEMALE', '2001-07-30', 'O-', '+1 (555) 678-9012', 'sophia.patel@example.com', '320 Market Street', 'San Francisco', 'Raj Patel', '+1 (555) 554-5678', 'Cigna Global', 'CG-889900-11', 'None known', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 8. Wards, Rooms, Beds
INSERT INTO wards (id, department_id, name, ward_type, floor, total_beds, status) VALUES
(1, 5, 'ICU Ward Alpha', 'ICU', '3rd Floor', 10, 'ACTIVE'),
(2, 6, 'General Medical Ward', 'GENERAL', '2nd Floor', 20, 'ACTIVE'),
(3, 4, 'Surgical Recovery Ward', 'SURGICAL', '4th Floor', 15, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rooms (id, ward_id, room_number, room_type, daily_rate, status) VALUES
(1, 1, 'ICU-301', 'ICU_PRIVATE', 850.00, 'AVAILABLE'),
(2, 2, 'GEN-201', 'SEMI_PRIVATE', 250.00, 'AVAILABLE'),
(3, 2, 'GEN-202', 'SEMI_PRIVATE', 250.00, 'AVAILABLE'),
(4, 3, 'SURG-401', 'PRIVATE', 450.00, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO beds (id, room_id, ward_id, bed_number, bed_type, status, daily_charge) VALUES
(1, 1, 1, 'ICU-301-A', 'ICU_ELECTRIC', 'OCCUPIED', 850.00),
(2, 2, 2, 'GEN-201-A', 'STANDARD', 'AVAILABLE', 250.00),
(3, 2, 2, 'GEN-201-B', 'STANDARD', 'AVAILABLE', 250.00),
(4, 3, 2, 'GEN-202-A', 'STANDARD', 'AVAILABLE', 250.00),
(5, 4, 3, 'SURG-401-A', 'ADJUSTABLE', 'AVAILABLE', 450.00)
ON CONFLICT (id) DO NOTHING;

-- 9. Appointments
INSERT INTO appointments (id, appointment_number, patient_id, doctor_id, department_id, appointment_date, start_time, end_time, type, status, reason, notes) VALUES
(1, 'APT-2026-0001', 1, 1, 1, CURRENT_DATE, '09:00:00', '09:30:00', 'CONSULTATION', 'COMPLETED', 'Follow-up ECG and blood pressure check', 'Patient responding well to beta blockers'),
(2, 'APT-2026-0002', 2, 2, 2, CURRENT_DATE, '10:00:00', '10:30:00', 'FOLLOW_UP', 'IN_PROGRESS', 'Persistent migraine headaches and visual aura', 'Order MRI brain if symptoms persist'),
(3, 'APT-2026-0003', 3, 3, 3, CURRENT_DATE, '11:15:00', '11:45:00', 'ROUTINE_CHECKUP', 'SCHEDULED', 'Pediatric annual wellness and immunization review', 'Up to date with vaccine schedule'),
(4, 'APT-2026-0004', 4, 4, 4, CURRENT_DATE + INTERVAL '1 day', '14:00:00', '14:30:00', 'POST_OPERATIVE', 'SCHEDULED', 'Right knee arthroscopy post-op 4-week review', 'Check mobility and wound healing')
ON CONFLICT (id) DO NOTHING;

-- Queue
INSERT INTO patient_queue (id, appointment_id, patient_id, doctor_id, department_id, token_number, priority, status, queue_date, check_in_time) VALUES
(1, 1, 1, 1, 1, 1, 'NORMAL', 'COMPLETED', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
(2, 2, 2, 2, 2, 2, 'NORMAL', 'IN_CONSULTATION', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(3, 3, 3, 3, 3, 3, 'URGENT', 'WAITING', CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- 10. Clinical Encounters, Vitals, Notes, Diagnoses
INSERT INTO encounters (id, encounter_number, patient_id, doctor_id, appointment_id, encounter_type, status, chief_complaint, start_time) VALUES
(1, 'ENC-2026-0001', 1, 1, 1, 'OPD', 'COMPLETED', 'Occasional chest tightness after mild exertion', CURRENT_TIMESTAMP - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO vital_signs (id, encounter_id, patient_id, temperature, systolic_bp, diastolic_bp, heart_rate, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by) VALUES
(1, 1, 1, 98.4, 128, 82, 74, 16, 98.5, 68.2, 168.0, 24.16, 'Nurse Elena Vance')
ON CONFLICT (id) DO NOTHING;

INSERT INTO clinical_notes (id, encounter_id, patient_id, doctor_id, note_type, subjective, objective, assessment, plan, summary) VALUES
(1, 1, 1, 1, 'SOAP', 'Patient reports mild exertional dyspnea, no nocturnal symptoms.', 'BP 128/82 mmHg, HR 74 regular. S1/S2 normal, no murmurs. Lungs clear bilaterally.', 'Mild essential hypertension, stable on medication.', 'Continue current beta blocker. Schedule follow-up lipid panel in 3 months.', 'Follow-up for essential hypertension. Exam unremarkable.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO diagnoses (id, encounter_id, patient_id, icd10_code, description, type, status) VALUES
(1, 1, 1, 'I10', 'Essential (primary) hypertension', 'PRIMARY', 'CONFIRMED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescriptions (id, prescription_number, encounter_id, patient_id, doctor_id, status, instructions) VALUES
(1, 'RX-2026-0001', 1, 1, 1, 'ACTIVE', 'Take medications daily in the morning with food.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration, route, instructions) VALUES
(1, 1, 'Metoprolol Tartrate', '25mg', 'Once Daily', '30 Days', 'ORAL', 'Take in the morning with water'),
(2, 1, 'Atorvastatin', '20mg', 'Once Daily', '30 Days', 'ORAL', 'Take at bedtime')
ON CONFLICT (id) DO NOTHING;

-- 11. Medicines & Inventory
INSERT INTO medicines (id, code, name, generic_name, category, dosage_form, strength, manufacturer, unit_price, status) VALUES
(1, 'MED-001', 'Amoxicillin Trihydrate', 'Amoxicillin', 'Antibiotic', 'Capsule', '500mg', 'Pfizer Inc.', 12.50, 'ACTIVE'),
(2, 'MED-002', 'Lipitor', 'Atorvastatin Calcium', 'Cardiovascular', 'Tablet', '20mg', 'Viatris', 18.00, 'ACTIVE'),
(3, 'MED-003', 'Glucophage', 'Metformin HCl', 'Antidiabetic', 'Tablet', '500mg', 'Merck KGaA', 8.50, 'ACTIVE'),
(4, 'MED-004', 'Prinivil', 'Lisinopril', 'Antihypertensive', 'Tablet', '10mg', 'AstraZeneca', 14.20, 'ACTIVE'),
(5, 'MED-005', 'Rocephin', 'Ceftriaxone', 'Cephalosporin Antibiotic', 'Injection', '1g', 'Roche', 35.00, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory_items (id, item_code, name, category, quantity, reorder_level, unit, unit_price, location, status) VALUES
(1, 'INV-001', 'Nitrile Medical Gloves (Box/100)', 'PPE', 350, 50, 'Boxes', 14.50, 'Warehouse A - Shelf 2', 'IN_STOCK'),
(2, 'INV-002', 'Normal Saline IV 0.9% 500ml', 'IV Solutions', 420, 80, 'Bags', 6.25, 'Pharmacy Cold Room', 'IN_STOCK'),
(3, 'INV-003', 'Sterile Disposable Syringes 5ml', 'Consumables', 850, 150, 'Units', 0.85, 'Supply Ward 1', 'IN_STOCK'),
(4, 'INV-004', 'N95 Respirator Masks (Box/50)', 'PPE', 18, 30, 'Boxes', 28.00, 'Warehouse A - Shelf 1', 'LOW_STOCK')
ON CONFLICT (id) DO NOTHING;

-- 12. Lab Tests & Orders
INSERT INTO lab_tests (id, test_code, name, category, sample_type, turnaround_time_hours, standard_rate, normal_range, unit, status) VALUES
(1, 'LAB-CBC', 'Complete Blood Count with Differential', 'Hematology', 'Whole Blood (EDTA)', 4, 45.00, 'WBC: 4.5-11.0, RBC: 4.2-5.9', 'x10^3/uL', 'ACTIVE'),
(2, 'LAB-CMP', 'Comprehensive Metabolic Panel (14 tests)', 'Biochemistry', 'Serum', 6, 65.00, 'Glucose: 70-99, BUN: 7-20', 'mg/dL', 'ACTIVE'),
(3, 'LAB-LIPID', 'Standard Lipid Profile', 'Biochemistry', 'Serum Fasting', 8, 55.00, 'Cholesterol: <200, LDL: <100', 'mg/dL', 'ACTIVE'),
(4, 'LAB-TROP', 'High-Sensitivity Troponin I', 'Cardiology Marker', 'Plasma', 2, 85.00, '< 0.04', 'ng/mL', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_orders (id, order_number, patient_id, doctor_id, encounter_id, priority, status, clinical_notes) VALUES
(1, 'LBO-2026-0001', 1, 1, 1, 'ROUTINE', 'COMPLETED', 'Routine 3-month lipid follow-up for hypertensive patient')
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_results (id, order_id, test_id, result_value, unit, reference_range, flag, technician_notes, verified_by) VALUES
(1, 1, 3, '182', 'mg/dL', '< 200', 'NORMAL', 'Specimen fasting, no hemolysis observed', 'Dr. Sarah Jenkins')
ON CONFLICT (id) DO NOTHING;

-- 13. Invoices & Payments
INSERT INTO invoices (id, invoice_number, patient_id, subtotal, tax_rate, tax_amount, discount, total_amount, paid_amount, balance_amount, payment_status, due_date) VALUES
(1, 'INV-2026-0001', 1, 205.00, 8.50, 17.43, 0.00, 222.43, 222.43, 0.00, 'PAID', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoice_items (id, invoice_id, item_type, description, quantity, unit_price, total_price) VALUES
(1, 1, 'CONSULTATION', 'Specialist Consultation - Cardiology', 1, 150.00, 150.00),
(2, 1, 'LABORATORY', 'Standard Lipid Profile', 1, 55.00, 55.00)
ON CONFLICT DO NOTHING;

INSERT INTO payments (id, payment_number, invoice_id, amount, payment_method, reference_number, status) VALUES
(1, 'PAY-2026-0001', 1, 222.43, 'CREDIT_CARD', 'TXN-99882211', 'COMPLETED')
ON CONFLICT (id) DO NOTHING;

-- 14. Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
(1, 1, 'System Initialized', 'MediCore HMS version 1.0 backend initialized successfully.', 'INFO', FALSE),
(2, 2, 'New Lab Results Ready', 'Lipid panel results ready for patient Eleanor Vance (MC-2026-001).', 'SUCCESS', FALSE),
(3, 1, 'Low Stock Alert', 'N95 Respirator Masks are below reorder threshold (18 remaining).', 'WARNING', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Synchronize sequence values so subsequent inserts won't conflict
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));
SELECT setval('permissions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM permissions));
SELECT setval('hospitals_id_seq', (SELECT COALESCE(MAX(id), 1) FROM hospitals));
SELECT setval('branches_id_seq', (SELECT COALESCE(MAX(id), 1) FROM branches));
SELECT setval('departments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM departments));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('doctors_id_seq', (SELECT COALESCE(MAX(id), 1) FROM doctors));
SELECT setval('patients_id_seq', (SELECT COALESCE(MAX(id), 1) FROM patients));
SELECT setval('wards_id_seq', (SELECT COALESCE(MAX(id), 1) FROM wards));
SELECT setval('rooms_id_seq', (SELECT COALESCE(MAX(id), 1) FROM rooms));
SELECT setval('beds_id_seq', (SELECT COALESCE(MAX(id), 1) FROM beds));
SELECT setval('appointments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM appointments));
SELECT setval('patient_queue_id_seq', (SELECT COALESCE(MAX(id), 1) FROM patient_queue));
SELECT setval('encounters_id_seq', (SELECT COALESCE(MAX(id), 1) FROM encounters));
SELECT setval('vital_signs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM vital_signs));
SELECT setval('clinical_notes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM clinical_notes));
SELECT setval('diagnoses_id_seq', (SELECT COALESCE(MAX(id), 1) FROM diagnoses));
SELECT setval('prescriptions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM prescriptions));
SELECT setval('prescription_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM prescription_items));
SELECT setval('medicines_id_seq', (SELECT COALESCE(MAX(id), 1) FROM medicines));
SELECT setval('inventory_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM inventory_items));
SELECT setval('lab_tests_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lab_tests));
SELECT setval('lab_orders_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lab_orders));
SELECT setval('lab_results_id_seq', (SELECT COALESCE(MAX(id), 1) FROM lab_results));
SELECT setval('invoices_id_seq', (SELECT COALESCE(MAX(id), 1) FROM invoices));
SELECT setval('invoice_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM invoice_items));
SELECT setval('payments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM payments));
SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));
