
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserForm } from "@/components/UserForm";
import { User as UserType } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";

const Users = () => {
  const { users, loading: usersLoading, error: usersError, createUser, updateUser, deleteUser } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Helper function to get role name from roleId
  const getRoleName = (roleId: string): string => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || "Unknown";
  };

  const filteredUsers = users.filter(user => {
    const roleName = getRoleName(user.roleId);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success("User deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  const handleSubmitUser = async (userData: Omit<UserType, "id" | "createdDate">) => {
    let result;
    
    if (editingUser) {
      result = await updateUser(editingUser.id, userData);
      if (result.success) {
        toast.success("User updated successfully");
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } else {
      result = await createUser(userData);
      if (result.success) {
        toast.success("User created successfully");
      } else {
        toast.error(result.error || "Failed to create user");
      }
    }

    if (result.success) {
      setShowUserForm(false);
      setEditingUser(null);
    }
  };

  const getRoleColor = (roleId: string) => {
    const roleName = getRoleName(roleId);
    switch (roleName) {
      case "Admin": return "bg-purple-100 text-purple-800";
      case "Manager": return "bg-blue-100 text-blue-800";
      case "Lawyer": return "bg-green-100 text-green-800";
      case "Paralegal": return "bg-yellow-100 text-yellow-800";
      case "Client": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: UserType['status']) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  if (usersLoading || rolesLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex flex-col h-screen">
              <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <div className="flex-1">
                    <h1 className="text-lg font-semibold">User Management</h1>
                  </div>
                </div>
              </header>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-lg">Loading users...</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (usersError) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex flex-col h-screen">
              <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <div className="flex-1">
                    <h1 className="text-lg font-semibent">User Management</h1>
                  </div>
                </div>
              </header>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-lg text-red-600">Error: {usersError}</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">User Management</h1>
                </div>
                <Button onClick={handleCreateUser}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                      Manage users and their roles in the system.
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-background min-w-[120px]"
                      >
                        <option value="">All Roles</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>
                      A list of all users in the system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getRoleColor(user.roleId)} border-0`}>
                                {getRoleName(user.roleId)}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(user.status)} border-0`}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.lastLogin 
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : "Never"
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {showUserForm && (
          <UserForm
            user={editingUser}
            roles={roles}
            onSubmit={handleSubmitUser}
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Users;
