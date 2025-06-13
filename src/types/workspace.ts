
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface WorkspaceWithMembers extends Workspace {
  members: (WorkspaceMember & { user_name?: string; user_email?: string })[];
}
