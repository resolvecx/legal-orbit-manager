
export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Lawyer" | "Paralegal" | "Client";
  department: string;
  phone?: string;
  avatar?: string;
  status: "Active" | "Inactive";
  createdDate: string;
  lastLogin?: string;
}

export interface UserPermissions {
  canCreateCases: boolean;
  canEditAllCases: boolean;
  canDeleteCases: boolean;
  canViewAllCases: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
}

export const rolePermissions: Record<User['role'], UserPermissions> = {
  Admin: {
    canCreateCases: true,
    canEditAllCases: true,
    canDeleteCases: true,
    canViewAllCases: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: true,
  },
  Manager: {
    canCreateCases: true,
    canEditAllCases: true,
    canDeleteCases: true,
    canViewAllCases: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: false,
  },
  Lawyer: {
    canCreateCases: true,
    canEditAllCases: false,
    canDeleteCases: false,
    canViewAllCases: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
  },
  Paralegal: {
    canCreateCases: true,
    canEditAllCases: false,
    canDeleteCases: false,
    canViewAllCases: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
  Client: {
    canCreateCases: false,
    canEditAllCases: false,
    canDeleteCases: false,
    canViewAllCases: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
};
