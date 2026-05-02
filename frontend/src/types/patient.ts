export type Patient = {
  id: string;
  medical_record_no: string;
  full_name: string;
  date_of_birth: Date;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  created_at: Date;
  updated_at: Date;
};
