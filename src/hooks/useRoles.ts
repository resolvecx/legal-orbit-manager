
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      // Use raw query since roles table is not in generated types yet
      const { data, error } = await supabase
        .rpc('get_roles_data');

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: rolesData, error: directError } = await supabase
          .from('roles' as any)
          .select('*')
          .order('created_at', { ascending: true });

        if (directError) throw directError;
        
        const formattedRoles: Role[] = rolesData?.map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description || '',
          permissions: role.permissions,
          isSystemRole: role.is_system_role,
          createdDate: new Date(role.created_at).toISOString().split('T')[0],
          updatedDate: new Date(role.updated_at).toISOString().split('T')[0]
        })) || [];

        setRoles(formattedRoles);
        return;
      }

      if (data) {
        setRoles(data);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      // Set default roles as fallback
      setRoles([
        {
          id: '1',
          name: 'Admin',
          description: 'Full system access',
          permissions: { canManageUsers: true, canManageRoles: true },
          isSystemRole: true,
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0]
        },
        {
          id: '2',
          name: 'Lawyer',
          description: 'Legal professional access',
          permissions: { canCreateCases: true, canViewAllCases: true },
          isSystemRole: true,
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0]
        },
        {
          id: '3',
          name: 'Paralegal',
          description: 'Legal assistant access',
          permissions: { canCreateCases: true },
          isSystemRole: true,
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (roleData: Omit<Role, "id" | "createdDate" | "updatedDate">) => {
    try {
      const { data, error } = await supabase
        .from('roles' as any)
        .insert({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          is_system_role: roleData.isSystemRole
        })
        .select()
        .single();

      if (error) throw error;

      const newRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: data.permissions,
        isSystemRole: data.is_system_role,
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        updatedDate: new Date(data.updated_at).toISOString().split('T')[0]
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
      const { data, error } = await supabase
        .from('roles' as any)
        .update({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          is_system_role: roleData.isSystemRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', roleId)
        .select()
        .single();

      if (error) throw error;

      const updatedRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: data.permissions,
        isSystemRole: data.is_system_role,
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        updatedDate: new Date(data.updated_at).toISOString().split('T')[0]
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
      const { error } = await supabase
        .from('roles' as any)
        .delete()
        .eq('id', roleId);

      if (error) throw error;

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
