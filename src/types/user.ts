
export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string; // Reference to role ID instead of hardcoded role
  department: string;
  phone?: string;
  avatar?: string;
  status: "Active" | "Inactive";
  createdDate: string;
  lastLogin?: string;
}
