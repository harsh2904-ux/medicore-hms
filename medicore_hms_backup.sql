--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admissions (
    id bigint NOT NULL,
    admission_number character varying(50) NOT NULL,
    patient_id bigint,
    attending_doctor_id bigint,
    bed_id bigint,
    admission_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    discharge_date timestamp with time zone,
    admission_type character varying(50) DEFAULT 'ELECTIVE'::character varying,
    status character varying(50) DEFAULT 'ADMITTED'::character varying,
    reason text,
    discharge_summary text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admissions OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admissions_id_seq OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admissions_id_seq OWNED BY public.admissions.id;


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id bigint NOT NULL,
    appointment_number character varying(50) NOT NULL,
    patient_id bigint,
    doctor_id bigint,
    department_id bigint,
    appointment_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    type character varying(50) DEFAULT 'CONSULTATION'::character varying,
    status character varying(50) DEFAULT 'SCHEDULED'::character varying,
    reason text,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    username character varying(100),
    action character varying(100) NOT NULL,
    resource_type character varying(100) NOT NULL,
    resource_id character varying(100),
    ip_address character varying(50),
    details text,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: beds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beds (
    id bigint NOT NULL,
    room_id bigint,
    ward_id bigint,
    bed_number character varying(50) NOT NULL,
    bed_type character varying(50) DEFAULT 'STANDARD'::character varying,
    status character varying(50) DEFAULT 'AVAILABLE'::character varying,
    daily_charge numeric(10,2) DEFAULT 150.00,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.beds OWNER TO postgres;

--
-- Name: beds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.beds_id_seq OWNER TO postgres;

--
-- Name: beds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beds_id_seq OWNED BY public.beds.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id bigint NOT NULL,
    hospital_id bigint,
    branch_code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    city character varying(100),
    phone character varying(50),
    is_main boolean DEFAULT false,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: clinical_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinical_notes (
    id bigint NOT NULL,
    encounter_id bigint,
    patient_id bigint,
    doctor_id bigint,
    note_type character varying(50) DEFAULT 'SOAP'::character varying,
    subjective text,
    objective text,
    assessment text,
    plan text,
    summary text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clinical_notes OWNER TO postgres;

--
-- Name: clinical_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clinical_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clinical_notes_id_seq OWNER TO postgres;

--
-- Name: clinical_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clinical_notes_id_seq OWNED BY public.clinical_notes.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id bigint NOT NULL,
    branch_id bigint,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    department_type character varying(50) DEFAULT 'CLINICAL'::character varying,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: diagnoses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diagnoses (
    id bigint NOT NULL,
    encounter_id bigint,
    patient_id bigint,
    icd10_code character varying(50),
    description character varying(255) NOT NULL,
    type character varying(50) DEFAULT 'PRIMARY'::character varying,
    status character varying(50) DEFAULT 'CONFIRMED'::character varying,
    diagnosed_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.diagnoses OWNER TO postgres;

--
-- Name: diagnoses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diagnoses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diagnoses_id_seq OWNER TO postgres;

--
-- Name: diagnoses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diagnoses_id_seq OWNED BY public.diagnoses.id;


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id bigint NOT NULL,
    user_id bigint,
    department_id bigint,
    doctor_code character varying(50) NOT NULL,
    specialization character varying(150) NOT NULL,
    license_number character varying(100) NOT NULL,
    consultation_fee numeric(10,2) DEFAULT 100.00,
    room_number character varying(50),
    available_days character varying(100) DEFAULT 'MON,TUE,WED,THU,FRI'::character varying,
    shift_start time without time zone DEFAULT '09:00:00'::time without time zone,
    shift_end time without time zone DEFAULT '17:00:00'::time without time zone,
    status character varying(50) DEFAULT 'AVAILABLE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctors_id_seq OWNER TO postgres;

--
-- Name: doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctors_id_seq OWNED BY public.doctors.id;


--
-- Name: emergency_triages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_triages (
    id bigint NOT NULL,
    triage_number character varying(50) NOT NULL,
    patient_id bigint,
    triage_level character varying(20) NOT NULL,
    chief_complaint text NOT NULL,
    vitals_summary text,
    status character varying(50) DEFAULT 'TRIAGED'::character varying,
    arrived_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.emergency_triages OWNER TO postgres;

--
-- Name: emergency_triages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_triages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_triages_id_seq OWNER TO postgres;

--
-- Name: emergency_triages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_triages_id_seq OWNED BY public.emergency_triages.id;


--
-- Name: encounters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encounters (
    id bigint NOT NULL,
    encounter_number character varying(50) NOT NULL,
    patient_id bigint,
    doctor_id bigint,
    appointment_id bigint,
    encounter_type character varying(50) DEFAULT 'OPD'::character varying,
    status character varying(50) DEFAULT 'IN_PROGRESS'::character varying,
    chief_complaint text,
    start_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    end_time timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.encounters OWNER TO postgres;

--
-- Name: encounters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encounters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encounters_id_seq OWNER TO postgres;

--
-- Name: encounters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encounters_id_seq OWNED BY public.encounters.id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- Name: hospitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospitals (
    id bigint NOT NULL,
    hospital_code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    legal_name character varying(255),
    email character varying(100),
    phone character varying(50),
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    postal_code character varying(20),
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    logo_url text,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hospitals OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospitals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospitals_id_seq OWNER TO postgres;

--
-- Name: hospitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospitals_id_seq OWNED BY public.hospitals.id;


--
-- Name: insurance_claims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance_claims (
    id bigint NOT NULL,
    claim_number character varying(50) NOT NULL,
    patient_id bigint,
    invoice_id bigint,
    provider_name character varying(150) NOT NULL,
    policy_number character varying(100) NOT NULL,
    claim_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    approved_amount numeric(10,2) DEFAULT 0.00,
    status character varying(50) DEFAULT 'PENDING'::character varying,
    submitted_date date DEFAULT CURRENT_DATE,
    approved_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.insurance_claims OWNER TO postgres;

--
-- Name: insurance_claims_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_claims_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_claims_id_seq OWNER TO postgres;

--
-- Name: insurance_claims_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_claims_id_seq OWNED BY public.insurance_claims.id;


--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_items (
    id bigint NOT NULL,
    item_code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    category character varying(100) NOT NULL,
    quantity integer DEFAULT 100,
    reorder_level integer DEFAULT 20,
    unit character varying(50) DEFAULT 'Units'::character varying,
    unit_price numeric(10,2) DEFAULT 15.00,
    location character varying(100),
    status character varying(50) DEFAULT 'IN_STOCK'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory_items OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_items_id_seq OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_items_id_seq OWNED BY public.inventory_items.id;


--
-- Name: invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice_items (
    id bigint NOT NULL,
    invoice_id bigint,
    item_type character varying(50) DEFAULT 'SERVICE'::character varying,
    description character varying(255) NOT NULL,
    quantity integer DEFAULT 1,
    unit_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_price numeric(10,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.invoice_items OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoice_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_items_id_seq OWNER TO postgres;

--
-- Name: invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoice_items_id_seq OWNED BY public.invoice_items.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id bigint NOT NULL,
    invoice_number character varying(50) NOT NULL,
    patient_id bigint,
    subtotal numeric(10,2) DEFAULT 0.00 NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0.00,
    tax_amount numeric(10,2) DEFAULT 0.00,
    discount numeric(10,2) DEFAULT 0.00,
    total_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    paid_amount numeric(10,2) DEFAULT 0.00,
    balance_amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_status character varying(50) DEFAULT 'UNPAID'::character varying,
    due_date date,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: lab_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_orders (
    id bigint NOT NULL,
    order_number character varying(50) NOT NULL,
    patient_id bigint,
    doctor_id bigint,
    encounter_id bigint,
    priority character varying(20) DEFAULT 'ROUTINE'::character varying,
    status character varying(50) DEFAULT 'ORDERED'::character varying,
    clinical_notes text,
    ordered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_orders OWNER TO postgres;

--
-- Name: lab_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_orders_id_seq OWNER TO postgres;

--
-- Name: lab_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_orders_id_seq OWNED BY public.lab_orders.id;


--
-- Name: lab_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_results (
    id bigint NOT NULL,
    order_id bigint,
    test_id bigint,
    result_value character varying(255),
    unit character varying(50),
    reference_range character varying(100),
    flag character varying(20) DEFAULT 'NORMAL'::character varying,
    technician_notes text,
    verified_by character varying(100),
    result_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lab_results OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_results_id_seq OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_results_id_seq OWNED BY public.lab_results.id;


--
-- Name: lab_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_tests (
    id bigint NOT NULL,
    test_code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    category character varying(100) NOT NULL,
    sample_type character varying(100),
    turnaround_time_hours integer DEFAULT 24,
    standard_rate numeric(10,2) DEFAULT 50.00,
    normal_range text,
    unit character varying(50),
    status character varying(50) DEFAULT 'ACTIVE'::character varying
);


ALTER TABLE public.lab_tests OWNER TO postgres;

--
-- Name: lab_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_tests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_tests_id_seq OWNER TO postgres;

--
-- Name: lab_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_tests_id_seq OWNED BY public.lab_tests.id;


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicines (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    generic_name character varying(150),
    category character varying(100),
    dosage_form character varying(50),
    strength character varying(50),
    manufacturer character varying(150),
    unit_price numeric(10,2) DEFAULT 10.00,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medicines OWNER TO postgres;

--
-- Name: medicines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medicines_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medicines_id_seq OWNER TO postgres;

--
-- Name: medicines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medicines_id_seq OWNED BY public.medicines.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'INFO'::character varying,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: nursing_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nursing_notes (
    id bigint NOT NULL,
    admission_id bigint,
    patient_id bigint,
    nurse_name character varying(100) NOT NULL,
    shift character varying(20) DEFAULT 'DAY'::character varying,
    note text NOT NULL,
    recorded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nursing_notes OWNER TO postgres;

--
-- Name: nursing_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nursing_notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nursing_notes_id_seq OWNER TO postgres;

--
-- Name: nursing_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nursing_notes_id_seq OWNED BY public.nursing_notes.id;


--
-- Name: patient_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_queue (
    id bigint NOT NULL,
    appointment_id bigint,
    patient_id bigint,
    doctor_id bigint,
    department_id bigint,
    token_number integer NOT NULL,
    priority character varying(20) DEFAULT 'NORMAL'::character varying,
    status character varying(50) DEFAULT 'WAITING'::character varying,
    queue_date date NOT NULL,
    check_in_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    called_time timestamp with time zone,
    completed_time timestamp with time zone
);


ALTER TABLE public.patient_queue OWNER TO postgres;

--
-- Name: patient_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_queue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_queue_id_seq OWNER TO postgres;

--
-- Name: patient_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_queue_id_seq OWNED BY public.patient_queue.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id bigint NOT NULL,
    mrn character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    gender character varying(20) NOT NULL,
    date_of_birth date NOT NULL,
    blood_group character varying(10),
    phone character varying(50) NOT NULL,
    email character varying(150),
    address text,
    city character varying(100),
    emergency_contact_name character varying(150),
    emergency_contact_phone character varying(50),
    insurance_provider character varying(150),
    insurance_policy_number character varying(100),
    allergies text,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id bigint NOT NULL,
    payment_number character varying(50) NOT NULL,
    invoice_id bigint,
    amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    payment_method character varying(50) DEFAULT 'CASH'::character varying,
    reference_number character varying(100),
    status character varying(50) DEFAULT 'COMPLETED'::character varying,
    payment_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    module character varying(50),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO postgres;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: pharmacy_dispensations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_dispensations (
    id bigint NOT NULL,
    dispense_number character varying(50) NOT NULL,
    prescription_id bigint,
    patient_id bigint,
    dispensed_by character varying(100),
    status character varying(50) DEFAULT 'DISPENSED'::character varying,
    total_amount numeric(10,2) DEFAULT 0.00,
    dispensed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pharmacy_dispensations OWNER TO postgres;

--
-- Name: pharmacy_dispensations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_dispensations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_dispensations_id_seq OWNER TO postgres;

--
-- Name: pharmacy_dispensations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_dispensations_id_seq OWNED BY public.pharmacy_dispensations.id;


--
-- Name: prescription_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription_items (
    id bigint NOT NULL,
    prescription_id bigint,
    medicine_name character varying(150) NOT NULL,
    dosage character varying(100) NOT NULL,
    frequency character varying(100) NOT NULL,
    duration character varying(100) NOT NULL,
    route character varying(50) DEFAULT 'ORAL'::character varying,
    instructions text
);


ALTER TABLE public.prescription_items OWNER TO postgres;

--
-- Name: prescription_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_items_id_seq OWNER TO postgres;

--
-- Name: prescription_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescription_items_id_seq OWNED BY public.prescription_items.id;


--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id bigint NOT NULL,
    prescription_number character varying(50) NOT NULL,
    encounter_id bigint,
    patient_id bigint,
    doctor_id bigint,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    instructions text,
    prescribed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- Name: radiology_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.radiology_orders (
    id bigint NOT NULL,
    order_number character varying(50) NOT NULL,
    patient_id bigint,
    doctor_id bigint,
    modality character varying(50) NOT NULL,
    body_part character varying(100) NOT NULL,
    priority character varying(20) DEFAULT 'ROUTINE'::character varying,
    status character varying(50) DEFAULT 'ORDERED'::character varying,
    findings text,
    impression text,
    radiologist_id bigint,
    ordered_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.radiology_orders OWNER TO postgres;

--
-- Name: radiology_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.radiology_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.radiology_orders_id_seq OWNER TO postgres;

--
-- Name: radiology_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.radiology_orders_id_seq OWNED BY public.radiology_orders.id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id bigint NOT NULL,
    permission_id bigint NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id bigint NOT NULL,
    ward_id bigint,
    room_number character varying(50) NOT NULL,
    room_type character varying(50) DEFAULT 'STANDARD'::character varying,
    daily_rate numeric(10,2) DEFAULT 0.00,
    status character varying(50) DEFAULT 'AVAILABLE'::character varying
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rooms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO postgres;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id bigint NOT NULL,
    user_id bigint,
    department_id bigint,
    staff_code character varying(50) NOT NULL,
    job_title character varying(100),
    employment_type character varying(50) DEFAULT 'FULL_TIME'::character varying,
    qualification character varying(255),
    joining_date date,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    hospital_id bigint,
    branch_id bigint,
    username character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(50),
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vital_signs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vital_signs (
    id bigint NOT NULL,
    encounter_id bigint,
    patient_id bigint,
    temperature numeric(5,2),
    systolic_bp integer,
    diastolic_bp integer,
    heart_rate integer,
    respiratory_rate integer,
    oxygen_saturation numeric(5,2),
    weight numeric(6,2),
    height numeric(5,2),
    bmi numeric(5,2),
    recorded_by character varying(100),
    recorded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vital_signs OWNER TO postgres;

--
-- Name: vital_signs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vital_signs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vital_signs_id_seq OWNER TO postgres;

--
-- Name: vital_signs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vital_signs_id_seq OWNED BY public.vital_signs.id;


--
-- Name: wards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wards (
    id bigint NOT NULL,
    department_id bigint,
    name character varying(100) NOT NULL,
    ward_type character varying(50) DEFAULT 'GENERAL'::character varying,
    floor character varying(20),
    total_beds integer DEFAULT 0,
    status character varying(50) DEFAULT 'ACTIVE'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wards OWNER TO postgres;

--
-- Name: wards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wards_id_seq OWNER TO postgres;

--
-- Name: wards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wards_id_seq OWNED BY public.wards.id;


--
-- Name: admissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions ALTER COLUMN id SET DEFAULT nextval('public.admissions_id_seq'::regclass);


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: beds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds ALTER COLUMN id SET DEFAULT nextval('public.beds_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: clinical_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes ALTER COLUMN id SET DEFAULT nextval('public.clinical_notes_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: diagnoses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses ALTER COLUMN id SET DEFAULT nextval('public.diagnoses_id_seq'::regclass);


--
-- Name: doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors ALTER COLUMN id SET DEFAULT nextval('public.doctors_id_seq'::regclass);


--
-- Name: emergency_triages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_triages ALTER COLUMN id SET DEFAULT nextval('public.emergency_triages_id_seq'::regclass);


--
-- Name: encounters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters ALTER COLUMN id SET DEFAULT nextval('public.encounters_id_seq'::regclass);


--
-- Name: hospitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals ALTER COLUMN id SET DEFAULT nextval('public.hospitals_id_seq'::regclass);


--
-- Name: insurance_claims id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims ALTER COLUMN id SET DEFAULT nextval('public.insurance_claims_id_seq'::regclass);


--
-- Name: inventory_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_items_id_seq'::regclass);


--
-- Name: invoice_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items ALTER COLUMN id SET DEFAULT nextval('public.invoice_items_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: lab_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders ALTER COLUMN id SET DEFAULT nextval('public.lab_orders_id_seq'::regclass);


--
-- Name: lab_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results ALTER COLUMN id SET DEFAULT nextval('public.lab_results_id_seq'::regclass);


--
-- Name: lab_tests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_tests ALTER COLUMN id SET DEFAULT nextval('public.lab_tests_id_seq'::regclass);


--
-- Name: medicines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines ALTER COLUMN id SET DEFAULT nextval('public.medicines_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: nursing_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_notes ALTER COLUMN id SET DEFAULT nextval('public.nursing_notes_id_seq'::regclass);


--
-- Name: patient_queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue ALTER COLUMN id SET DEFAULT nextval('public.patient_queue_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: pharmacy_dispensations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_dispensations ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_dispensations_id_seq'::regclass);


--
-- Name: prescription_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items ALTER COLUMN id SET DEFAULT nextval('public.prescription_items_id_seq'::regclass);


--
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- Name: radiology_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders ALTER COLUMN id SET DEFAULT nextval('public.radiology_orders_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vital_signs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs ALTER COLUMN id SET DEFAULT nextval('public.vital_signs_id_seq'::regclass);


--
-- Name: wards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards ALTER COLUMN id SET DEFAULT nextval('public.wards_id_seq'::regclass);


--
-- Data for Name: admissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admissions (id, admission_number, patient_id, attending_doctor_id, bed_id, admission_date, discharge_date, admission_type, status, reason, discharge_summary, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, appointment_number, patient_id, doctor_id, department_id, appointment_date, start_time, end_time, type, status, reason, notes, created_at, updated_at) FROM stdin;
1	APT-2026-0001	1	1	1	2026-09-30	09:00:00	09:30:00	CONSULTATION	COMPLETED	Follow-up ECG and blood pressure check	Patient responding well to beta blockers	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
2	APT-2026-0002	2	2	2	2026-09-30	10:00:00	10:30:00	FOLLOW_UP	IN_PROGRESS	Persistent migraine headaches and visual aura	Order MRI brain if symptoms persist	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	APT-2026-0003	3	3	3	2026-09-30	11:15:00	11:45:00	ROUTINE_CHECKUP	SCHEDULED	Pediatric annual wellness and immunization review	Up to date with vaccine schedule	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	APT-2026-0004	4	4	4	2026-10-01	14:00:00	14:30:00	POST_OPERATIVE	SCHEDULED	Right knee arthroscopy post-op 4-week review	Check mobility and wound healing	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
5	APT-2026-C8591	11	4	1	2026-10-02	11:00:00	11:30:00	TELECONSULT	CONFIRMED	testing	olll	2026-10-01 13:35:09.599955+05:30	2026-10-01 13:35:31.61621+05:30
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, username, action, resource_type, resource_id, ip_address, details, "timestamp") FROM stdin;
\.


--
-- Data for Name: beds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beds (id, room_id, ward_id, bed_number, bed_type, status, daily_charge, created_at) FROM stdin;
1	1	1	ICU-301-A	ICU_ELECTRIC	OCCUPIED	850.00	2026-09-30 23:27:02.767995+05:30
2	2	2	GEN-201-A	STANDARD	AVAILABLE	250.00	2026-09-30 23:27:02.767995+05:30
3	2	2	GEN-201-B	STANDARD	AVAILABLE	250.00	2026-09-30 23:27:02.767995+05:30
4	3	2	GEN-202-A	STANDARD	AVAILABLE	250.00	2026-09-30 23:27:02.767995+05:30
5	4	3	SURG-401-A	ADJUSTABLE	AVAILABLE	450.00	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, hospital_id, branch_code, name, address, city, phone, is_main, status, created_at, updated_at) FROM stdin;
1	1	MC-BR-01	Main Campus	100 Medical Center Way, Suite 100	San Francisco	+1 (555) 019-2834	t	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: clinical_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinical_notes (id, encounter_id, patient_id, doctor_id, note_type, subjective, objective, assessment, plan, summary, created_at) FROM stdin;
1	1	1	1	SOAP	Patient reports mild exertional dyspnea, no nocturnal symptoms.	BP 128/82 mmHg, HR 74 regular. S1/S2 normal, no murmurs. Lungs clear bilaterally.	Mild essential hypertension, stable on medication.	Continue current beta blocker. Schedule follow-up lipid panel in 3 months.	Follow-up for essential hypertension. Exam unremarkable.	2026-09-30 23:27:02.767995+05:30
2	\N	1	\N	SOAP	Patient reports mild exertional dyspnea, no nocturnal symptoms.	BP 128/82 mmHg, HR 74 regular. S1/S2 normal, no murmurs. Lungs clear bilaterally.	Essential (primary) hypertension	Continue current beta blocker. Schedule follow-up lipid panel in 3 months.	Patient reports mild exertional dyspnea, no nocturnal symptoms. - Dr. Rajesh Mehta	2026-10-01 13:38:38.889747+05:30
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, branch_id, code, name, description, department_type, status, created_at, updated_at) FROM stdin;
1	1	CARD	Cardiology	Heart and cardiovascular care	CLINICAL	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
2	1	NEUR	Neurology	Brain and nervous system disorders	CLINICAL	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	1	PED	Pediatrics	Comprehensive child healthcare	CLINICAL	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	1	ORTHO	Orthopedics	Musculoskeletal and sports medicine	CLINICAL	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
5	1	EMERG	Emergency Medicine	24/7 Level-1 trauma and acute care	EMERGENCY	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
6	1	GEN	General Medicine	Primary care and internal medicine	CLINICAL	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
7	1	RAD	Radiology & Imaging	Diagnostic CT, MRI, X-ray and Ultrasound	DIAGNOSTIC	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
8	1	PATH	Pathology & Laboratory	Clinical diagnostic and blood testing	DIAGNOSTIC	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
9	1	PHARM	Pharmacy	Inpatient and outpatient pharmaceuticals	PHARMACY	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: diagnoses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diagnoses (id, encounter_id, patient_id, icd10_code, description, type, status, diagnosed_date) FROM stdin;
1	1	1	I10	Essential (primary) hypertension	PRIMARY	CONFIRMED	2026-09-30
2	\N	1	Z00.0	Essential (primary) hypertension	PRIMARY	CONFIRMED	2026-10-01
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, user_id, department_id, doctor_code, specialization, license_number, consultation_fee, room_number, available_days, shift_start, shift_end, status, created_at, updated_at) FROM stdin;
1	2	1	DOC-001	Interventional Cardiology	CA-MD-98231	150.00	301-A	MON,TUE,WED,THU,FRI	08:30:00	16:30:00	AVAILABLE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
2	\N	2	DOC-002	Neurology & Stroke Care	CA-MD-77412	175.00	302-B	MON,TUE,WED,THU	09:00:00	17:00:00	AVAILABLE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	\N	3	DOC-003	Pediatric Medicine	CA-MD-66321	120.00	205-C	MON,WED,FRI	09:00:00	15:00:00	AVAILABLE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	\N	4	DOC-004	Orthopedic Surgery	CA-MD-55109	200.00	410-A	TUE,THU,SAT	08:00:00	14:00:00	AVAILABLE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: emergency_triages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_triages (id, triage_number, patient_id, triage_level, chief_complaint, vitals_summary, status, arrived_at) FROM stdin;
\.


--
-- Data for Name: encounters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encounters (id, encounter_number, patient_id, doctor_id, appointment_id, encounter_type, status, chief_complaint, start_time, end_time, created_at, updated_at) FROM stdin;
1	ENC-2026-0001	1	1	1	OPD	COMPLETED	Occasional chest tightness after mild exertion	2026-09-30 21:27:02.767995+05:30	\N	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	initial schema	SQL	V1__initial_schema.sql	2037428137	postgres	2026-09-30 23:27:02.185135	87	t
2	2	patients and staff	SQL	V2__patients_and_staff.sql	-55078974	postgres	2026-09-30 23:27:02.30677	78	t
3	3	appointments and queue	SQL	V3__appointments_and_queue.sql	328550089	postgres	2026-09-30 23:27:02.401663	25	t
4	4	clinical and emr	SQL	V4__clinical_and_emr.sql	-920905885	postgres	2026-09-30 23:27:02.433398	48	t
5	5	lab and radiology	SQL	V5__lab_and_radiology.sql	-645377112	postgres	2026-09-30 23:27:02.493917	41	t
6	6	pharmacy and inventory	SQL	V6__pharmacy_and_inventory.sql	-732534429	postgres	2026-09-30 23:27:02.552328	33	t
7	7	billing and insurance	SQL	V7__billing_and_insurance.sql	1976359035	postgres	2026-09-30 23:27:02.596062	47	t
8	8	ipd and emergency	SQL	V8__ipd_and_emergency.sql	280607302	postgres	2026-09-30 23:27:02.65359	37	t
9	9	notifications and audit	SQL	V9__notifications_and_audit.sql	983910549	postgres	2026-09-30 23:27:02.700289	38	t
10	10	seed data	SQL	V10__seed_data.sql	-826887001	postgres	2026-09-30 23:27:02.747261	130	t
\.


--
-- Data for Name: hospitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospitals (id, hospital_code, name, legal_name, email, phone, address, city, state, country, postal_code, timezone, logo_url, status, created_at, updated_at) FROM stdin;
1	MC-MAIN	MediCore Central Hospital	MediCore Health Enterprises Inc.	contact@medicore.com	+1 (555) 019-2834	100 Medical Center Way	San Francisco	CA	USA	94143	America/Los_Angeles	\N	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: insurance_claims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insurance_claims (id, claim_number, patient_id, invoice_id, provider_name, policy_number, claim_amount, approved_amount, status, submitted_date, approved_date, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_items (id, item_code, name, category, quantity, reorder_level, unit, unit_price, location, status, created_at, updated_at) FROM stdin;
1	INV-001	Nitrile Medical Gloves (Box/100)	PPE	350	50	Boxes	14.50	Warehouse A - Shelf 2	IN_STOCK	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
2	INV-002	Normal Saline IV 0.9% 500ml	IV Solutions	420	80	Bags	6.25	Pharmacy Cold Room	IN_STOCK	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	INV-003	Sterile Disposable Syringes 5ml	Consumables	850	150	Units	0.85	Supply Ward 1	IN_STOCK	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	INV-004	N95 Respirator Masks (Box/50)	PPE	18	30	Boxes	28.00	Warehouse A - Shelf 1	LOW_STOCK	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice_items (id, invoice_id, item_type, description, quantity, unit_price, total_price) FROM stdin;
1	1	CONSULTATION	Specialist Consultation - Cardiology	1	150.00	150.00
2	1	LABORATORY	Standard Lipid Profile	1	55.00	55.00
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, invoice_number, patient_id, subtotal, tax_rate, tax_amount, discount, total_amount, paid_amount, balance_amount, payment_status, due_date, notes, created_at, updated_at) FROM stdin;
1	INV-2026-0001	1	205.00	8.50	17.43	0.00	222.43	222.43	0.00	PAID	2026-09-30	\N	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: lab_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_orders (id, order_number, patient_id, doctor_id, encounter_id, priority, status, clinical_notes, ordered_at) FROM stdin;
1	LBO-2026-0001	1	1	1	ROUTINE	COMPLETED	Routine 3-month lipid follow-up for hypertensive patient	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: lab_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_results (id, order_id, test_id, result_value, unit, reference_range, flag, technician_notes, verified_by, result_date) FROM stdin;
1	1	3	182	mg/dL	< 200	NORMAL	Specimen fasting, no hemolysis observed	Dr. Sarah Jenkins	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: lab_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_tests (id, test_code, name, category, sample_type, turnaround_time_hours, standard_rate, normal_range, unit, status) FROM stdin;
1	LAB-CBC	Complete Blood Count with Differential	Hematology	Whole Blood (EDTA)	4	45.00	WBC: 4.5-11.0, RBC: 4.2-5.9	x10^3/uL	ACTIVE
2	LAB-CMP	Comprehensive Metabolic Panel (14 tests)	Biochemistry	Serum	6	65.00	Glucose: 70-99, BUN: 7-20	mg/dL	ACTIVE
3	LAB-LIPID	Standard Lipid Profile	Biochemistry	Serum Fasting	8	55.00	Cholesterol: <200, LDL: <100	mg/dL	ACTIVE
4	LAB-TROP	High-Sensitivity Troponin I	Cardiology Marker	Plasma	2	85.00	< 0.04	ng/mL	ACTIVE
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicines (id, code, name, generic_name, category, dosage_form, strength, manufacturer, unit_price, status, created_at) FROM stdin;
1	MED-001	Amoxicillin Trihydrate	Amoxicillin	Antibiotic	Capsule	500mg	Pfizer Inc.	12.50	ACTIVE	2026-09-30 23:27:02.767995+05:30
2	MED-002	Lipitor	Atorvastatin Calcium	Cardiovascular	Tablet	20mg	Viatris	18.00	ACTIVE	2026-09-30 23:27:02.767995+05:30
3	MED-003	Glucophage	Metformin HCl	Antidiabetic	Tablet	500mg	Merck KGaA	8.50	ACTIVE	2026-09-30 23:27:02.767995+05:30
4	MED-004	Prinivil	Lisinopril	Antihypertensive	Tablet	10mg	AstraZeneca	14.20	ACTIVE	2026-09-30 23:27:02.767995+05:30
5	MED-005	Rocephin	Ceftriaxone	Cephalosporin Antibiotic	Injection	1g	Roche	35.00	ACTIVE	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, type, is_read, created_at) FROM stdin;
1	1	System Initialized	MediCore HMS version 1.0 backend initialized successfully.	INFO	t	2026-09-30 23:27:02.767995+05:30
2	2	New Lab Results Ready	Lipid panel results ready for patient Eleanor Vance (MC-2026-001).	SUCCESS	t	2026-09-30 23:27:02.767995+05:30
3	1	Low Stock Alert	N95 Respirator Masks are below reorder threshold (18 remaining).	WARNING	t	2026-09-30 23:27:02.767995+05:30
4	\N	fggf	fsgsr	WARNING	t	2026-10-01 13:55:03.55922+05:30
5	\N	k	l;ljg	WARNING	t	2026-10-01 13:56:38.156228+05:30
\.


--
-- Data for Name: nursing_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nursing_notes (id, admission_id, patient_id, nurse_name, shift, note, recorded_at) FROM stdin;
\.


--
-- Data for Name: patient_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_queue (id, appointment_id, patient_id, doctor_id, department_id, token_number, priority, status, queue_date, check_in_time, called_time, completed_time) FROM stdin;
1	1	1	1	1	1	NORMAL	COMPLETED	2026-09-30	2026-09-30 21:27:02.767995+05:30	\N	\N
2	2	2	2	2	2	NORMAL	IN_CONSULTATION	2026-09-30	2026-09-30 22:42:02.767995+05:30	\N	\N
3	3	3	3	3	3	URGENT	WAITING	2026-09-30	2026-09-30 23:12:02.767995+05:30	\N	\N
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, mrn, first_name, last_name, gender, date_of_birth, blood_group, phone, email, address, city, emergency_contact_name, emergency_contact_phone, insurance_provider, insurance_policy_number, allergies, status, created_at, updated_at) FROM stdin;
1	MC-2026-001	Eleanor	Vance	FEMALE	1985-04-12	A+	+1 (555) 234-5678	eleanor.vance@example.com	742 Evergreen Terrace	San Francisco	Eli Vance	+1 (555) 998-1234	Blue Cross Blue Shield	BCBS-992384-01	Penicillin, Sulfa	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
2	MC-2026-002	David	Kim	MALE	1978-09-23	O+	+1 (555) 345-6789	david.kim@example.com	1204 Pine Street, Apt 4B	San Francisco	Sun-Hi Kim	+1 (555) 887-2345	Aetna Health	AET-771239-09	None known	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	MC-2026-003	Maria	Rodriguez	FEMALE	1992-11-05	B+	+1 (555) 456-7890	maria.r@example.com	88 Mission Bay Blvd	San Francisco	Carlos Rodriguez	+1 (555) 776-3456	UnitedHealthcare	UHC-445566-02	Aspirin	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	MC-2026-004	James	Wilson	MALE	1965-02-18	AB+	+1 (555) 567-8901	j.wilson@example.com	500 Howard Street	San Francisco	Patricia Wilson	+1 (555) 665-4567	Kaiser Permanente	KP-112233-04	Latex	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
5	MC-2026-005	Sophia	Patel	FEMALE	2001-07-30	O-	+1 (555) 678-9012	sophia.patel@example.com	320 Market Street	San Francisco	Raj Patel	+1 (555) 554-5678	Cigna Global	CG-889900-11	None known	ACTIVE	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
6	MC-2026-8ACD5	Test	Patient	MALE	1990-05-15	O+	+1 (555) 999-8888	test.patient@example.com	123 Test St	San Francisco	Emergency Contact	+1 (555) 000-1111	\N	\N	Penicillin	Active	2026-10-01 11:44:33.987663+05:30	2026-10-01 11:44:33.987663+05:30
7	MC-2026-DD06F	Rachel	Green	FEMALE	1994-05-05	B+	+1 (555) 789-0123	rachel.green@medicore.health	90 Bedford St, Apt 20	New York	Monica Geller	+1 (555) 321-6540	\N	\N	Peanuts	Active	2026-10-01 11:48:58.480851+05:30	2026-10-01 11:48:58.480851+05:30
8	MC-2026-64072	HARSH	MUPPAWAR	MALE	1995-05-15	O+	+91 98201 	harshmuppawar011@gmail.com	Shreeswada bhawan behind dhanshree bank, Ward no. 9 shramik nagar	Chandrapur	HARSH DIWAKAR MUPPAWAR	+91 98201 	\N	\N		Active	2026-10-01 11:50:44.466651+05:30	2026-10-01 11:50:44.466651+05:30
9	MC-2026-98F9D	Tanmay singh	Singh	MALE	1995-05-11	O+	+91 98201 	harshmuppawar011@gmail.com	Road no 6 bopkhel	Pune	SCOUTOP	+91 98201 	\N	\N		Active	2026-10-01 11:53:49.765532+05:30	2026-10-01 11:53:49.765532+05:30
10	MC-2026-57325	Robert	Langdon	MALE	1980-05-20	O+	+1 (555) 777-8899	robert.langdon@harvard.edu	12 Harvard Yard	Cambridge	Vittoria Vetra	+1 (555) 777-9900	\N	\N	\N	ACTIVE	2026-10-01 13:33:59.51837+05:30	2026-10-01 13:33:59.51837+05:30
11	MC-2026-B9B8A	HARSH	MUPPAWAR	MALE	1995-06-15	O+	+919764478380	harshmuppawar011@gmail.com	Shreeswada bhawan behind dhanshree bank, Ward no. 9 shramik nagar	Mumbai	\N	\N	\N	\N		Active	2026-10-01 13:34:30.735669+05:30	2026-10-01 13:34:30.735669+05:30
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, payment_number, invoice_id, amount, payment_method, reference_number, status, payment_date) FROM stdin;
1	PAY-2026-0001	1	222.43	CREDIT_CARD	TXN-99882211	COMPLETED	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description, module, created_at) FROM stdin;
1	READ_PATIENTS	View patient records	PATIENT	2026-09-30 23:27:02.767995+05:30
2	WRITE_PATIENTS	Create and edit patient records	PATIENT	2026-09-30 23:27:02.767995+05:30
3	READ_APPOINTMENTS	View appointments	APPOINTMENT	2026-09-30 23:27:02.767995+05:30
4	WRITE_APPOINTMENTS	Book and manage appointments	APPOINTMENT	2026-09-30 23:27:02.767995+05:30
5	READ_CLINICAL	View clinical notes and EMR	CLINICAL	2026-09-30 23:27:02.767995+05:30
6	WRITE_CLINICAL	Add clinical notes, vitals, prescriptions	CLINICAL	2026-09-30 23:27:02.767995+05:30
7	READ_LAB	View lab orders and results	LAB	2026-09-30 23:27:02.767995+05:30
8	WRITE_LAB	Record lab orders and enter results	LAB	2026-09-30 23:27:02.767995+05:30
9	READ_PHARMACY	View medicines and inventory	PHARMACY	2026-09-30 23:27:02.767995+05:30
10	WRITE_PHARMACY	Dispense prescriptions and adjust stock	PHARMACY	2026-09-30 23:27:02.767995+05:30
11	READ_BILLING	View invoices and payments	BILLING	2026-09-30 23:27:02.767995+05:30
12	WRITE_BILLING	Generate invoices and record payments	BILLING	2026-09-30 23:27:02.767995+05:30
13	ADMIN_ACCESS	Full administrative and configuration rights	ADMIN	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: pharmacy_dispensations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_dispensations (id, dispense_number, prescription_id, patient_id, dispensed_by, status, total_amount, dispensed_at) FROM stdin;
\.


--
-- Data for Name: prescription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration, route, instructions) FROM stdin;
1	1	Metoprolol Tartrate	25mg	Once Daily	30 Days	ORAL	Take in the morning with water
2	1	Atorvastatin	20mg	Once Daily	30 Days	ORAL	Take at bedtime
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, prescription_number, encounter_id, patient_id, doctor_id, status, instructions, prescribed_at) FROM stdin;
1	RX-2026-0001	1	1	1	ACTIVE	Take medications daily in the morning with food.	2026-09-30 23:27:02.767995+05:30
2	RX-2026-EBE2F	\N	1	\N	ACTIVE	Ecosprin 75 mg (75 mg) Once daily x 30d; Rosuvas 20 mg (20 mg) Before bed x 30d; Telma 40 mg (40 mg) Once daily x 30d; Sorbitrate 5 mg (5 mg) SOS / As needed x 14d	2026-10-01 13:38:38.94031+05:30
\.


--
-- Data for Name: radiology_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.radiology_orders (id, order_number, patient_id, doctor_id, modality, body_part, priority, status, findings, impression, radiologist_id, ordered_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
1	10
1	11
1	12
1	13
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at) FROM stdin;
1	ROLE_ADMIN	Full system administrator	2026-09-30 23:27:02.767995+05:30
2	ROLE_DOCTOR	Licensed physician / consultant	2026-09-30 23:27:02.767995+05:30
3	ROLE_NURSE	Registered clinical nurse	2026-09-30 23:27:02.767995+05:30
4	ROLE_RECEPTIONIST	Front desk and registration staff	2026-09-30 23:27:02.767995+05:30
5	ROLE_PHARMACIST	Pharmacy and medication manager	2026-09-30 23:27:02.767995+05:30
6	ROLE_LAB_TECHNICIAN	Laboratory and diagnostic technician	2026-09-30 23:27:02.767995+05:30
7	ROLE_BILLING	Billing and accounts officer	2026-09-30 23:27:02.767995+05:30
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, ward_id, room_number, room_type, daily_rate, status) FROM stdin;
1	1	ICU-301	ICU_PRIVATE	850.00	AVAILABLE
2	2	GEN-201	SEMI_PRIVATE	250.00	AVAILABLE
3	2	GEN-202	SEMI_PRIVATE	250.00	AVAILABLE
4	3	SURG-401	PRIVATE	450.00	AVAILABLE
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (id, user_id, department_id, staff_code, job_title, employment_type, qualification, joining_date, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
1	1
2	2
3	3
4	4
5	2
6	3
7	5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, hospital_id, branch_id, username, email, password_hash, first_name, last_name, phone, status, last_login_at, created_at, updated_at) FROM stdin;
2	1	1	doctor	doctor@medicore.com	$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te	Sarah	Jenkins	+1 (555) 010-0002	ACTIVE	\N	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
3	1	1	nurse	nurse@medicore.com	$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te	Elena	Vance	+1 (555) 010-0003	ACTIVE	\N	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
4	1	1	reception	reception@medicore.com	$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te	Michael	Scott	+1 (555) 010-0004	ACTIVE	\N	2026-09-30 23:27:02.767995+05:30	2026-09-30 23:27:02.767995+05:30
7	1	1	harshmuppawar011	harshmuppawar011@gmail.com	$2a$10$FEFEg7b5oKXpWYu8sFjOWuN4hQ7dsKn.DLTZtlWsaEaBCdULCQ72G	HARSH	MUPPAWAR	+919764478380	ACTIVE	2026-10-01 14:02:05.118675+05:30	2026-10-01 13:19:23.721164+05:30	2026-10-01 14:02:05.17774+05:30
5	1	1	johnwatson	john.watson@medicore.health	$2a$10$65cMEdhBx6nLdzSx3JXPMuDCKlC82R/3E/1W/GkvPuWO7f6T.5Vl6	Dr. John	Watson	+1 (555) 777-6655	ACTIVE	2026-10-01 12:31:25.123335+05:30	2026-10-01 12:31:24.897515+05:30	2026-10-01 12:31:25.125903+05:30
1	1	1	admin	admin@medicore.com	$2a$10$6Ty46CWNe9Dzq1OwVUYBjOpayfYzS9uv2UHF8T5iydpxRsOAE10Te	Alexander	Wright	+1 (555) 010-0001	ACTIVE	2026-10-02 20:41:42.400861+05:30	2026-09-30 23:27:02.767995+05:30	2026-10-02 20:41:42.400861+05:30
6	1	1	sarahconnor	sarah.connor@medicore.org	$2a$10$dA8Hj9Y23JYluiY52P64Du/WG20WrsLZ2dJSmvMZFJ/spx5SrBVyK	Sarah	Connor	+1-555-0199	ACTIVE	2026-10-01 12:47:03.535494+05:30	2026-10-01 12:44:31.281019+05:30	2026-10-01 12:47:03.535494+05:30
\.


--
-- Data for Name: vital_signs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vital_signs (id, encounter_id, patient_id, temperature, systolic_bp, diastolic_bp, heart_rate, respiratory_rate, oxygen_saturation, weight, height, bmi, recorded_by, recorded_at) FROM stdin;
1	1	1	98.40	128	82	74	16	98.50	68.20	168.00	24.16	Nurse Elena Vance	2026-09-30 23:27:02.767995+05:30
2	\N	1	98.40	128	82	74	16	98.50	68.20	168.00	\N	Dr. Rajesh Mehta	2026-10-01 13:38:38.834731+05:30
\.


--
-- Data for Name: wards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wards (id, department_id, name, ward_type, floor, total_beds, status, created_at) FROM stdin;
1	5	ICU Ward Alpha	ICU	3rd Floor	10	ACTIVE	2026-09-30 23:27:02.767995+05:30
2	6	General Medical Ward	GENERAL	2nd Floor	20	ACTIVE	2026-09-30 23:27:02.767995+05:30
3	4	Surgical Recovery Ward	SURGICAL	4th Floor	15	ACTIVE	2026-09-30 23:27:02.767995+05:30
\.


--
-- Name: admissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admissions_id_seq', 1, false);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 5, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: beds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beds_id_seq', 5, true);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 1, true);


--
-- Name: clinical_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clinical_notes_id_seq', 2, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 9, true);


--
-- Name: diagnoses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diagnoses_id_seq', 2, true);


--
-- Name: doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctors_id_seq', 4, true);


--
-- Name: emergency_triages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_triages_id_seq', 1, false);


--
-- Name: encounters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encounters_id_seq', 1, true);


--
-- Name: hospitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospitals_id_seq', 1, true);


--
-- Name: insurance_claims_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insurance_claims_id_seq', 1, false);


--
-- Name: inventory_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_items_id_seq', 4, true);


--
-- Name: invoice_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoice_items_id_seq', 2, true);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, true);


--
-- Name: lab_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_orders_id_seq', 1, true);


--
-- Name: lab_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_results_id_seq', 1, true);


--
-- Name: lab_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_tests_id_seq', 4, true);


--
-- Name: medicines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medicines_id_seq', 5, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 5, true);


--
-- Name: nursing_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nursing_notes_id_seq', 1, false);


--
-- Name: patient_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_queue_id_seq', 3, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 11, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 13, true);


--
-- Name: pharmacy_dispensations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_dispensations_id_seq', 1, true);


--
-- Name: prescription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescription_items_id_seq', 2, true);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 2, true);


--
-- Name: radiology_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.radiology_orders_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rooms_id_seq', 4, true);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: vital_signs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vital_signs_id_seq', 2, true);


--
-- Name: wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wards_id_seq', 3, true);


--
-- Name: admissions admissions_admission_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_admission_number_key UNIQUE (admission_number);


--
-- Name: admissions admissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_appointment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_appointment_number_key UNIQUE (appointment_number);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: beds beds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_pkey PRIMARY KEY (id);


--
-- Name: branches branches_branch_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_branch_code_key UNIQUE (branch_code);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: clinical_notes clinical_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: diagnoses diagnoses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_doctor_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_doctor_code_key UNIQUE (doctor_code);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: emergency_triages emergency_triages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_triages
    ADD CONSTRAINT emergency_triages_pkey PRIMARY KEY (id);


--
-- Name: emergency_triages emergency_triages_triage_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_triages
    ADD CONSTRAINT emergency_triages_triage_number_key UNIQUE (triage_number);


--
-- Name: encounters encounters_encounter_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters
    ADD CONSTRAINT encounters_encounter_number_key UNIQUE (encounter_number);


--
-- Name: encounters encounters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters
    ADD CONSTRAINT encounters_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: hospitals hospitals_hospital_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_hospital_code_key UNIQUE (hospital_code);


--
-- Name: hospitals hospitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospitals
    ADD CONSTRAINT hospitals_pkey PRIMARY KEY (id);


--
-- Name: insurance_claims insurance_claims_claim_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims
    ADD CONSTRAINT insurance_claims_claim_number_key UNIQUE (claim_number);


--
-- Name: insurance_claims insurance_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims
    ADD CONSTRAINT insurance_claims_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_item_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_item_code_key UNIQUE (item_code);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: invoice_items invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: lab_orders lab_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_order_number_key UNIQUE (order_number);


--
-- Name: lab_orders lab_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_pkey PRIMARY KEY (id);


--
-- Name: lab_results lab_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_pkey PRIMARY KEY (id);


--
-- Name: lab_tests lab_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_tests
    ADD CONSTRAINT lab_tests_pkey PRIMARY KEY (id);


--
-- Name: lab_tests lab_tests_test_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_tests
    ADD CONSTRAINT lab_tests_test_code_key UNIQUE (test_code);


--
-- Name: medicines medicines_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_code_key UNIQUE (code);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: nursing_notes nursing_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_notes
    ADD CONSTRAINT nursing_notes_pkey PRIMARY KEY (id);


--
-- Name: patient_queue patient_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue
    ADD CONSTRAINT patient_queue_pkey PRIMARY KEY (id);


--
-- Name: patients patients_mrn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_mrn_key UNIQUE (mrn);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: payments payments_payment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_key UNIQUE (payment_number);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_key UNIQUE (name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_dispensations pharmacy_dispensations_dispense_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_dispensations
    ADD CONSTRAINT pharmacy_dispensations_dispense_number_key UNIQUE (dispense_number);


--
-- Name: pharmacy_dispensations pharmacy_dispensations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_dispensations
    ADD CONSTRAINT pharmacy_dispensations_pkey PRIMARY KEY (id);


--
-- Name: prescription_items prescription_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_prescription_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_prescription_number_key UNIQUE (prescription_number);


--
-- Name: radiology_orders radiology_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders
    ADD CONSTRAINT radiology_orders_order_number_key UNIQUE (order_number);


--
-- Name: radiology_orders radiology_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders
    ADD CONSTRAINT radiology_orders_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: staff staff_staff_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_staff_code_key UNIQUE (staff_code);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vital_signs vital_signs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_pkey PRIMARY KEY (id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_admissions_bed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admissions_bed ON public.admissions USING btree (bed_id);


--
-- Name: idx_admissions_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admissions_patient ON public.admissions USING btree (patient_id);


--
-- Name: idx_appointments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_date ON public.appointments USING btree (appointment_date);


--
-- Name: idx_appointments_doctor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_doctor ON public.appointments USING btree (doctor_id);


--
-- Name: idx_appointments_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_patient ON public.appointments USING btree (patient_id);


--
-- Name: idx_audit_logs_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp");


--
-- Name: idx_audit_logs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_departments_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_departments_branch ON public.departments USING btree (branch_id);


--
-- Name: idx_doctors_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_doctors_code ON public.doctors USING btree (doctor_code);


--
-- Name: idx_doctors_dept; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_doctors_dept ON public.doctors USING btree (department_id);


--
-- Name: idx_encounters_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_encounters_patient ON public.encounters USING btree (patient_id);


--
-- Name: idx_inventory_items_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_items_code ON public.inventory_items USING btree (item_code);


--
-- Name: idx_invoices_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_patient ON public.invoices USING btree (patient_id);


--
-- Name: idx_invoices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invoices_status ON public.invoices USING btree (payment_status);


--
-- Name: idx_lab_orders_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_orders_patient ON public.lab_orders USING btree (patient_id);


--
-- Name: idx_medicines_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_medicines_name ON public.medicines USING btree (name);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_patients_mrn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_patients_mrn ON public.patients USING btree (mrn);


--
-- Name: idx_patients_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_patients_phone ON public.patients USING btree (phone);


--
-- Name: idx_payments_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_invoice ON public.payments USING btree (invoice_id);


--
-- Name: idx_prescriptions_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prescriptions_patient ON public.prescriptions USING btree (patient_id);


--
-- Name: idx_queue_date_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_queue_date_status ON public.patient_queue USING btree (queue_date, status);


--
-- Name: idx_rad_orders_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rad_orders_patient ON public.radiology_orders USING btree (patient_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_vitals_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vitals_patient ON public.vital_signs USING btree (patient_id);


--
-- Name: admissions admissions_attending_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_attending_doctor_id_fkey FOREIGN KEY (attending_doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: admissions admissions_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.beds(id) ON DELETE SET NULL;


--
-- Name: admissions admissions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: beds beds_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- Name: beds beds_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id) ON DELETE CASCADE;


--
-- Name: branches branches_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;


--
-- Name: clinical_notes clinical_notes_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: clinical_notes clinical_notes_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_encounter_id_fkey FOREIGN KEY (encounter_id) REFERENCES public.encounters(id) ON DELETE CASCADE;


--
-- Name: clinical_notes clinical_notes_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_notes
    ADD CONSTRAINT clinical_notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: departments departments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: diagnoses diagnoses_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_encounter_id_fkey FOREIGN KEY (encounter_id) REFERENCES public.encounters(id) ON DELETE CASCADE;


--
-- Name: diagnoses diagnoses_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diagnoses
    ADD CONSTRAINT diagnoses_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: doctors doctors_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: emergency_triages emergency_triages_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_triages
    ADD CONSTRAINT emergency_triages_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: encounters encounters_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters
    ADD CONSTRAINT encounters_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL;


--
-- Name: encounters encounters_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters
    ADD CONSTRAINT encounters_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: encounters encounters_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encounters
    ADD CONSTRAINT encounters_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: insurance_claims insurance_claims_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims
    ADD CONSTRAINT insurance_claims_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE SET NULL;


--
-- Name: insurance_claims insurance_claims_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims
    ADD CONSTRAINT insurance_claims_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: invoice_items invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice_items
    ADD CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: invoices invoices_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: lab_orders lab_orders_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: lab_orders lab_orders_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_encounter_id_fkey FOREIGN KEY (encounter_id) REFERENCES public.encounters(id) ON DELETE SET NULL;


--
-- Name: lab_orders lab_orders_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_orders
    ADD CONSTRAINT lab_orders_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: lab_results lab_results_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.lab_orders(id) ON DELETE CASCADE;


--
-- Name: lab_results lab_results_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.lab_tests(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: nursing_notes nursing_notes_admission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_notes
    ADD CONSTRAINT nursing_notes_admission_id_fkey FOREIGN KEY (admission_id) REFERENCES public.admissions(id) ON DELETE CASCADE;


--
-- Name: nursing_notes nursing_notes_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_notes
    ADD CONSTRAINT nursing_notes_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: patient_queue patient_queue_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue
    ADD CONSTRAINT patient_queue_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE SET NULL;


--
-- Name: patient_queue patient_queue_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue
    ADD CONSTRAINT patient_queue_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: patient_queue patient_queue_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue
    ADD CONSTRAINT patient_queue_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: patient_queue patient_queue_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_queue
    ADD CONSTRAINT patient_queue_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: payments payments_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;


--
-- Name: pharmacy_dispensations pharmacy_dispensations_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_dispensations
    ADD CONSTRAINT pharmacy_dispensations_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: pharmacy_dispensations pharmacy_dispensations_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_dispensations
    ADD CONSTRAINT pharmacy_dispensations_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id) ON DELETE SET NULL;


--
-- Name: prescription_items prescription_items_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id) ON DELETE CASCADE;


--
-- Name: prescriptions prescriptions_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: prescriptions prescriptions_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_encounter_id_fkey FOREIGN KEY (encounter_id) REFERENCES public.encounters(id) ON DELETE SET NULL;


--
-- Name: prescriptions prescriptions_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: radiology_orders radiology_orders_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders
    ADD CONSTRAINT radiology_orders_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: radiology_orders radiology_orders_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders
    ADD CONSTRAINT radiology_orders_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: radiology_orders radiology_orders_radiologist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_orders
    ADD CONSTRAINT radiology_orders_radiologist_id_fkey FOREIGN KEY (radiologist_id) REFERENCES public.doctors(id) ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: rooms rooms_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id) ON DELETE CASCADE;


--
-- Name: staff staff_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE SET NULL;


--
-- Name: users users_hospital_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_hospital_id_fkey FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE SET NULL;


--
-- Name: vital_signs vital_signs_encounter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_encounter_id_fkey FOREIGN KEY (encounter_id) REFERENCES public.encounters(id) ON DELETE CASCADE;


--
-- Name: vital_signs vital_signs_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vital_signs
    ADD CONSTRAINT vital_signs_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: wards wards_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

