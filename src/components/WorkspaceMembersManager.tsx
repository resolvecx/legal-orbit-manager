import React, { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface WorkspaceMembersManagerProps {
  workspaceId: string;
  workspaceName: string;
}

export const WorkspaceMembersManager = ({ workspaceId, workspaceName }: WorkspaceMembersManagerProps) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");
  const [members, setMembers] = useState<WorkspaceMember[]>([
    { id: "1", workspace_id: workspaceId, user_id: "1", role: "admin", joined_at: new Date().toISOString() },
    { id: "2", workspace_id: workspaceId, user_id: "2", role: "member", joined_at: new Date().toISOString() }
  ]);

  const mockUsers = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
    { id: "4", name: "Alice Wilson", email: "alice@example.com" },
  ];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    
    const newMember: WorkspaceMember = {
      id: `member-${Date.now()}`,
      workspace_id: workspaceId,
      user_id: selectedUserId,
      role: selectedRole,
      joined_at: new Date().toISOString()
    };
    
    setMembers(prev => [...prev, newMember]);
    setSelectedUserId("");
    setSelectedRole("member");
    toast.success("Member added successfully");
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast.success("Member removed successfully");
    }
  };

  const availableUsers = mockUsers.filter(user => 
    !members.some(member => member.user_id === user.id)
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
            <Button type="submit" disabled={!selectedUserId}>
              Add Member
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Members</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
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