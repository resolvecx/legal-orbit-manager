
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  User,
  MoreHorizontal
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

const mockUsers: UserType[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@lawfirm.com",
    role: "Admin",
    department: "Administration",
    phone: "+1 (555) 123-4567",
    status: "Active",
    createdDate: "2024-01-15",
    lastLogin: "2024-06-11T10:30:00Z"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@lawfirm.com",
    role: "Lawyer",
    department: "Litigation",
    phone: "+1 (555) 234-5678",
    status: "Active",
    createdDate: "2024-02-01",
    lastLogin: "2024-06-11T09:15:00Z"
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@lawfirm.com",
    role: "Paralegal",
    department: "Corporate",
    phone: "+1 (555) 345-6789",
    status: "Active",
    createdDate: "2024-03-10",
    lastLogin: "2024-06-10T16:45:00Z"
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@client.com",
    role: "Client",
    department: "External",
    status: "Active",
    createdDate: "2024-04-05",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert.brown@lawfirm.com",
    role: "Manager",
    department: "Operations",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    createdDate: "2024-01-20",
    lastLogin: "2024-05-15T14:20:00Z"
  }
];

const Users = () => {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
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

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSubmitUser = (userData: Omit<UserType, "id" | "createdDate">) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...userData, id: editingUser.id, createdDate: editingUser.createdDate }
          : user
      ));
    } else {
      const newUser: UserType = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    setShowUserForm(false);
    setEditingUser(null);
  };

  const getRoleColor = (role: UserType['role']) => {
    switch (role) {
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
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Lawyer">Lawyer</option>
                        <option value="Paralegal">Paralegal</option>
                        <option value="Client">Client</option>
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
                              <Badge className={`${getRoleColor(user.role)} border-0`}>
                                {user.role}
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
