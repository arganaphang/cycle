-- DROP TRIGGER trg_users_updated_at ON users;
-- DROP TRIGGER trg_patients_updated_at ON patients;
-- DROP TRIGGER trg_staff_updated_at ON staff;
-- DROP TRIGGER trg_appointments_updated_at ON appointments;
-- DROP TRIGGER trg_ts_updated_at ON treatment_sessions;
-- DROP TRIGGER trg_soap_updated_at ON soap_notes;

DROP FUNCTION set_updated_at() cascade;

DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_patients_mrn;
DROP INDEX IF EXISTS idx_patients_name;
DROP INDEX IF EXISTS idx_appt_patient;
DROP INDEX IF EXISTS idx_appt_staff;
DROP INDEX IF EXISTS idx_appt_scheduled;
DROP INDEX IF EXISTS idx_appt_status;
DROP INDEX IF EXISTS idx_ts_patient;
DROP INDEX IF EXISTS idx_ts_staff;
DROP INDEX IF EXISTS idx_ts_date;
DROP INDEX IF EXISTS idx_ts_appointment;
DROP INDEX IF EXISTS idx_soap_session;

DROP TABLE IF EXISTS soap_notes;
DROP TABLE IF EXISTS treatment_sessions;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;

DROP TYPE user_role;
DROP TYPE gender;
DROP TYPE appointment_status;
DROP TYPE session_status;

DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pgcrypto";