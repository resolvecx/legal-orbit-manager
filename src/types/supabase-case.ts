
export interface SupabaseCase {
  id: string;
  user_id: string;
  title: string;
  client: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assigned_to: string;
  due_date: string;
  type: string;
  description?: string;
  created_date: string;
  created_at: string;
  updated_at: string;
}

export interface CaseFormData {
  title: string;
  client: string;
  status: 'Open' | 'In Progress' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  dueDate: string;
  type: string;
  description: string;
}
