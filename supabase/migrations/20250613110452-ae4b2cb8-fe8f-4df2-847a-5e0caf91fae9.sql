
-- Create workspaces table
CREATE TABLE public.workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workspace_members table to manage user membership
CREATE TABLE public.workspace_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL, -- Reference to user ID from your user system
  role TEXT DEFAULT 'member', -- Role within the workspace (member, admin, etc.)
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate memberships
ALTER TABLE public.workspace_members ADD CONSTRAINT unique_workspace_user UNIQUE (workspace_id, user_id);

-- Enable Row Level Security
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Create policies for workspaces (for now, allow all authenticated users to manage)
CREATE POLICY "Allow all operations on workspaces" 
  ON public.workspaces 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for workspace_members
CREATE POLICY "Allow all operations on workspace_members" 
  ON public.workspace_members 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
