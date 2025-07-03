
-- Create roles table
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table that extends the auth system
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_id UUID REFERENCES public.roles(id),
  department TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for roles
CREATE POLICY "Users can view roles" 
  ON public.roles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage roles" 
  ON public.roles 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- RLS policies for app_users
CREATE POLICY "Users can view all app users" 
  ON public.app_users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage app users" 
  ON public.app_users 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Insert default roles
INSERT INTO public.roles (name, description, permissions, is_system_role) VALUES
('Admin', 'Full system access with all permissions', 
 '{"canCreateCases": true, "canEditAllCases": true, "canDeleteCases": true, "canViewAllCases": true, "canManageUsers": true, "canViewReports": true, "canManageSettings": true, "canManageRoles": true}', 
 true),
('Manager', 'Management level access with user and case oversight', 
 '{"canCreateCases": true, "canEditAllCases": true, "canDeleteCases": true, "canViewAllCases": true, "canManageUsers": true, "canViewReports": true, "canManageSettings": false, "canManageRoles": false}', 
 true),
('Lawyer', 'Legal professional with case management access', 
 '{"canCreateCases": true, "canEditAllCases": false, "canDeleteCases": false, "canViewAllCases": true, "canManageUsers": false, "canViewReports": true, "canManageSettings": false, "canManageRoles": false}', 
 true),
('Paralegal', 'Legal assistant with limited case access', 
 '{"canCreateCases": true, "canEditAllCases": false, "canDeleteCases": false, "canViewAllCases": false, "canManageUsers": false, "canViewReports": false, "canManageSettings": false, "canManageRoles": false}', 
 true),
('Client', 'External client with view-only access', 
 '{"canCreateCases": false, "canEditAllCases": false, "canDeleteCases": false, "canViewAllCases": false, "canManageUsers": false, "canViewReports": false, "canManageSettings": false, "canManageRoles": false}', 
 true);

-- Insert sample users
INSERT INTO public.app_users (name, email, role_id, department, phone, status, last_login) 
SELECT 
  'John Smith', 'john.smith@lawfirm.com', r.id, 'Administration', '+1 (555) 123-4567', 'Active', '2024-06-11T10:30:00Z'
FROM public.roles r WHERE r.name = 'Admin'
UNION ALL
SELECT 
  'Sarah Johnson', 'sarah.johnson@lawfirm.com', r.id, 'Litigation', '+1 (555) 234-5678', 'Active', '2024-06-11T09:15:00Z'
FROM public.roles r WHERE r.name = 'Lawyer'
UNION ALL
SELECT 
  'Michael Davis', 'michael.davis@lawfirm.com', r.id, 'Corporate', '+1 (555) 345-6789', 'Active', '2024-06-10T16:45:00Z'
FROM public.roles r WHERE r.name = 'Paralegal'
UNION ALL
SELECT 
  'Emily Wilson', 'emily.wilson@client.com', r.id, 'External', NULL, 'Active', NULL
FROM public.roles r WHERE r.name = 'Client'
UNION ALL
SELECT 
  'Robert Brown', 'robert.brown@lawfirm.com', r.id, 'Operations', '+1 (555) 456-7890', 'Inactive', '2024-05-15T14:20:00Z'
FROM public.roles r WHERE r.name = 'Manager';
