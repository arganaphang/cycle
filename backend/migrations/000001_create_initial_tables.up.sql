-- ============================================================
-- Physiotherapy EMR — PostgreSQL Migration
-- File: 001_initial_schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'THERAPIST',
    'RECEPTIONIST'
);

CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE'
);

CREATE TYPE appointment_status AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
);

CREATE TYPE session_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);

-- ============================================================
-- TABLES
-- ============================================================

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          user_role    NOT NULL DEFAULT 'THERAPIST',
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_unique UNIQUE (email)
);

-- 2. patients
CREATE TABLE IF NOT EXISTS patients (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_record_no   VARCHAR(50)  NOT NULL,
    full_name           VARCHAR(255) NOT NULL,
    date_of_birth       DATE         NOT NULL,
    gender              gender       NOT NULL,
    phone               VARCHAR(20),
    email               VARCHAR(255),
    address             TEXT,
    -- { "name": "...", "phone": "...", "relation": "..." }
    emergency_contact   JSONB,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT patients_mrn_unique UNIQUE (medical_record_no)
);

-- 3. staff
CREATE TABLE IF NOT EXISTS staff (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID         NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    specialization  VARCHAR(255),
    license_no      VARCHAR(100),
    phone           VARCHAR(20),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT staff_user_fk      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT staff_user_unique  UNIQUE (user_id)
);

-- 4. appointments
CREATE TABLE IF NOT EXISTS appointments (
    id               UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id       UUID               NOT NULL,
    staff_id         UUID               NOT NULL,
    scheduled_at     TIMESTAMPTZ        NOT NULL,
    duration_min     INT                NOT NULL DEFAULT 60,
    status           appointment_status NOT NULL DEFAULT 'SCHEDULED',
    chief_complaint  TEXT,
    notes            TEXT,
    created_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),

    CONSTRAINT appointments_patient_fk FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE RESTRICT,
    CONSTRAINT appointments_staff_fk   FOREIGN KEY (staff_id)   REFERENCES staff    (id) ON DELETE RESTRICT,
    CONSTRAINT appointments_duration_check CHECK (duration_min > 0)
);

-- 5. treatment_sessions
CREATE TABLE IF NOT EXISTS treatment_sessions (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    -- nullable: walk-in patients have no prior appointment
    appointment_id  UUID,
    patient_id      UUID           NOT NULL,
    staff_id        UUID           NOT NULL,
    session_date    DATE           NOT NULL DEFAULT CURRENT_DATE,
    -- computed on insert: SELECT COUNT(*)+1 FROM treatment_sessions WHERE patient_id = $1
    session_no      INT            NOT NULL,
    status          session_status NOT NULL DEFAULT 'IN_PROGRESS',
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT ts_appointment_fk FOREIGN KEY (appointment_id) REFERENCES appointments       (id) ON DELETE SET NULL,
    CONSTRAINT ts_patient_fk     FOREIGN KEY (patient_id)     REFERENCES patients           (id) ON DELETE RESTRICT,
    CONSTRAINT ts_staff_fk       FOREIGN KEY (staff_id)       REFERENCES staff              (id) ON DELETE RESTRICT,
    CONSTRAINT ts_appointment_unique UNIQUE (appointment_id),
    CONSTRAINT ts_session_no_check   CHECK (session_no > 0)
);

-- 6. soap_notes
CREATE TABLE IF NOT EXISTS soap_notes (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID        NOT NULL,
    subjective  TEXT        NOT NULL,   -- S: patient reports
    objective   TEXT        NOT NULL,   -- O: therapist findings / measurements
    assessment  TEXT        NOT NULL,   -- A: diagnosis / interpretation
    plan        TEXT        NOT NULL,   -- P: treatment plan / next steps
    pain_scale  INT,                    -- 0-10 NRS
    -- { "bp": "120/80", "hr": 72, "spo2": 98, "temp": 36.5, "weight": 65 }
    vitals      JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT soap_session_fk     FOREIGN KEY (session_id) REFERENCES treatment_sessions (id) ON DELETE CASCADE,
    CONSTRAINT soap_session_unique UNIQUE (session_id),
    CONSTRAINT soap_pain_scale_check CHECK (pain_scale IS NULL OR (pain_scale >= 0 AND pain_scale <= 10))
);

-- ============================================================
-- INDEXES
-- ============================================================

-- users
CREATE INDEX idx_users_email      ON users (email);
CREATE INDEX idx_users_role       ON users (role);

-- patients
CREATE INDEX idx_patients_mrn     ON patients (medical_record_no);
CREATE INDEX idx_patients_name    ON patients (full_name);

-- appointments
CREATE INDEX idx_appt_patient     ON appointments (patient_id);
CREATE INDEX idx_appt_staff       ON appointments (staff_id);
CREATE INDEX idx_appt_scheduled   ON appointments (scheduled_at);
CREATE INDEX idx_appt_status      ON appointments (status);

-- treatment_sessions
CREATE INDEX idx_ts_patient       ON treatment_sessions (patient_id);
CREATE INDEX idx_ts_staff         ON treatment_sessions (staff_id);
CREATE INDEX idx_ts_date          ON treatment_sessions (session_date);
CREATE INDEX idx_ts_appointment   ON treatment_sessions (appointment_id);

-- soap_notes
CREATE INDEX idx_soap_session     ON soap_notes (session_id);

-- ============================================================
-- updated_at TRIGGER (auto-update on row change)
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS '
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
' LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ts_updated_at
    BEFORE UPDATE ON treatment_sessions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_soap_updated_at
    BEFORE UPDATE ON soap_notes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
