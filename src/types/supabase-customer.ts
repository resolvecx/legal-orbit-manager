
export interface SupabaseCustomer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  customer_type: 'Individual' | 'Business';
  assigned_lawyer?: string;
  notes?: string;
  created_date: string;
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  customerType: 'Individual' | 'Business';
  assignedLawyer: string;
  notes: string;
  lastContact: string;
}
