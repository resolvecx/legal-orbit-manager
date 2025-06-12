
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  isSystemRole: boolean; // System roles cannot be deleted
  createdDate: string;
  updatedDate: string;
}

export interface RolePermissions {
  canCreateCases: boolean;
  canEditAllCases: boolean;
  canDeleteCases: boolean;
  canViewAllCases: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canManageRoles: boolean;
}

export const defaultPermissions: RolePermissions = {
  canCreateCases: false,
  canEditAllCases: false,
  canDeleteCases: false,
  canViewAllCases: false,
  canManageUsers: false,
  canViewReports: false,
  canManageSettings: false,
  canManageRoles: false,
};

export const permissionLabels: Record<keyof RolePermissions, string> = {
  canCreateCases: "Create Cases",
  canEditAllCases: "Edit All Cases",
  canDeleteCases: "Delete Cases",
  canViewAllCases: "View All Cases",
  canManageUsers: "Manage Users",
  canViewReports: "View Reports",
  canManageSettings: "Manage Settings",
  canManageRoles: "Manage Roles",
};
