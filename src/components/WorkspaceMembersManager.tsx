
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@/types/user";
import type { WorkspaceMember } from "@/types/workspace";

interface WorkspaceMembersManagerProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceMembersManager = ({ workspaceId, workspaceName }: WorkspaceMembersManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const queryClient = useQueryClient();

  // Mock users data - in a real app, this would come from your users table
  const mockUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", roleId: "1", department: "Legal", status: "Active", createdDate: "2024-01-01" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", roleId: "2", department: "HR", status: "Active", createdDate: "2024-01-02" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", roleId: "1", department: "Legal", status: "Active", createdDate: "2024-01-03" },
    { id: "4", name: "Alice Wilson", email: "alice@example.com", roleId: "3", department: "IT", status: "Active", createdDate: "2024-01-04" },
  ];

  const { data: members, isLoading } = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId);
      
      if (error) throw error;
      return data as WorkspaceMember[];
    }
  });

  const addMemberMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: userId,
          role: role
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      setSelectedUserId("");
      setSelectedRole("member");
      toast.success("Member added successfully");
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error("User is already a member of this workspace");
      } else {
        toast.error("Failed to add member");
      }
      console.error('Error adding member:', error);
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      toast.success("Member removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove member");
      console.error('Error removing member:', error);
    }
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    
    addMemberMutation.mutate({ userId: selectedUserId, role: selectedRole });
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this member from the workspace?")) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const availableUsers = mockUsers.filter(user => 
    !members?.some(member => member.user_id === user.id)
  );

  const getMemberDetails = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add New Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMember} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={!selectedUserId || addMemberMutation.isPending}
            >
              {addMemberMutation.isPending ? "Adding..." : "Add Member"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading members...</div>
          ) : members && members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const userDetails = getMemberDetails(member.user_id);
                  return (
                    <TableRow key={member.id}>
                      <TableCell>{userDetails?.name || 'Unknown User'}</TableCell>
                      <TableCell>{userDetails?.email || 'Unknown Email'}</TableCell>
                      <TableCell className="capitalize">{member.role}</TableCell>
                      <TableCell>{new Date(member.joined_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No members in this workspace yet. Add some members to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
