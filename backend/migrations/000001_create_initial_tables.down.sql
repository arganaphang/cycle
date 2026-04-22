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
DROP TABLE IF EXISTS staffs;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;

DROP TYPE user_role;
DROP TYPE gender;
DROP TYPE appointment_status;
DROP TYPE session_status;

DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "pgcrypto";