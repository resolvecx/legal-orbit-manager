import { useState, useEffect } from 'react';
import { Role, defaultPermissions } from '@/types/role';

// Mock data
const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access to all system features',
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
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage cases and view reports',
    permissions: {
      canCreateCases: true,
      canEditAllCases: true,
      canDeleteCases: false,
      canViewAllCases: true,
      canManageUsers: false,
      canViewReports: true,
      canManageSettings: false,
      canManageRoles: false,
    },
    isSystemRole: false,
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic access to create and view own cases',
    permissions: {
      canCreateCases: true,
      canEditAllCases: false,
      canDeleteCases: false,
      canViewAllCases: false,
      canManageUsers: false,
      canViewReports: false,
      canManageSettings: false,
      canManageRoles: false,
    },
    isSystemRole: false,
    createdDate: '2024-01-01',
    updatedDate: '2024-01-01'
  }
];

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setRoles([...mockRoles]);
      setError(null);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: Omit<Role, "id" | "createdDate" | "updatedDate">) => {
    try {
      const newRole: Role = {
        ...roleData,
        id: `role-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };

      setRoles(prev => [...prev, newRole]);
      return { success: true };
    } catch (err) {
      console.error('Error creating role:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create role' };
    }
  };

  const updateRole = async (roleId: string, roleData: Omit<Role, "id" | "createdDate" | "updatedDate">) => {
    try {
      const existingRole = roles.find(r => r.id === roleId);
      const updatedRole: Role = {
        ...roleData,
        id: roleId,
        createdDate: existingRole?.createdDate || new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0]
      };

      setRoles(prev => prev.map(role => role.id === roleId ? updatedRole : role));
      return { success: true };
    } catch (err) {
      console.error('Error updating role:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update role' };
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      setRoles(prev => prev.filter(role => role.id !== roleId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting role:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete role' };
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refetch: fetchRoles
  };
}