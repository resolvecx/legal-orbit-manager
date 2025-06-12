
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: "Active" | "Inactive" | "Prospect";
  customerType: "Individual" | "Business";
  assignedLawyer?: string;
  notes?: string;
  createdDate: string;
  lastContact?: string;
}
