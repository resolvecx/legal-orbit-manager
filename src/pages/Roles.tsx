
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
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Users
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RoleForm } from "@/components/RoleForm";
import { Role, RolePermissions } from "@/types/role";

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: {
      canCreateCases: true,
      canEditAllCases: true,
      canDeleteCases: true,
      canViewAllCases: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: true,
      canManageRoles: true,
    },
    isSystemRole: true,
    createdDate: "2024-01-15",
    updatedDate: "2024-01-15"
  },
  {
    id: "2",
    name: "Manager",
    description: "Management level access with user and case oversight",
    permissions: {
      canCreateCases: true,
      canEditAllCases: true,
      canDeleteCases: true,
      canViewAllCases: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: false,
      canManageRoles: false,
    },
    isSystemRole: true,
    createdDate: "2024-01-15",
    updatedDate: "2024-01-15"
  },
  {
    id: "3",
    name: "Lawyer",
    description: "Legal professional with case management access",
    permissions: {
      canCreateCases: true,
      canEditAllCases: false,
      canDeleteCases: false,
      canViewAllCases: true,
      canManageUsers: false,
      canViewReports: true,
      canManageSettings: false,
      canManageRoles: false,
    },
    isSystemRole: true,
    createdDate: "2024-01-15",
    updatedDate: "2024-01-15"
  },
  {
    id: "4",
    name: "Custom Role",
    description: "Custom role with specific permissions",
    permissions: {
      canCreateCases: true,
      canEditAllCases: false,
      canDeleteCases: false,
      canViewAllCases: false,
      canManageUsers: false,
      canViewReports: true,
      canManageSettings: false,
      canManageRoles: false,
    },
    isSystemRole: false,
    createdDate: "2024-02-10",
    updatedDate: "2024-02-10"
  }
];

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      alert("System roles cannot be deleted");
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handleSubmitRole = (roleData: Omit<Role, "id" | "createdDate" | "updatedDate">) => {
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { 
              ...roleData, 
              id: editingRole.id, 
              createdDate: editingRole.createdDate,
              updatedDate: new Date().toISOString().split('T')[0]
            }
          : role
      ));
    } else {
      const newRole: Role = {
        ...roleData,
        id: Math.random().toString(36).substr(2, 9),
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
    }
    setShowRoleForm(false);
    setEditingRole(null);
  };

  const getPermissionCount = (permissions: RolePermissions) => {
    return Object.values(permissions).filter(Boolean).length;
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
                  <h1 className="text-lg font-semibold">Role Management</h1>
                </div>
                <Button onClick={handleCreateRole}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
                    <p className="text-muted-foreground">
                      Manage roles and their permissions in the system.
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Roles Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Roles ({filteredRoles.length})</CardTitle>
                    <CardDescription>
                      A list of all roles and their permissions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Role</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead>Users</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRoles.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-sm text-muted-foreground">{role.description}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${role.isSystemRole ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} border-0`}>
                                {role.isSystemRole ? "System" : "Custom"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getPermissionCount(role.permissions)} of 8 permissions
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {Math.floor(Math.random() * 20) + 1}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(role.createdDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRole(role)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {!role.isSystemRole && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRole(role.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
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

        {showRoleForm && (
          <RoleForm
            role={editingRole}
            onSubmit={handleSubmitRole}
            onCancel={() => {
              setShowRoleForm(false);
              setEditingRole(null);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Roles;
