
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Role, defaultPermissions } from '@/types/role';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching roles:', error);
        setError(error.message);
        setRoles([]);
        return;
      }

      if (data) {
        const formattedRoles: Role[] = (data as any[]).map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description || '',
          permissions: role.permissions || defaultPermissions,
          isSystemRole: role.is_system_role,
          createdDate: new Date(role.created_at).toISOString().split('T')[0],
          updatedDate: new Date(role.updated_at).toISOString().split('T')[0]
        }));

        setRoles(formattedRoles);
      }
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
      const { data, error } = await supabase
        .from('roles')
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
        id: (data as any).id,
        name: (data as any).name,
        description: (data as any).description || '',
        permissions: (data as any).permissions,
        isSystemRole: (data as any).is_system_role,
        createdDate: new Date((data as any).created_at).toISOString().split('T')[0],
        updatedDate: new Date((data as any).updated_at).toISOString().split('T')[0]
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
        .from('roles')
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
        id: (data as any).id,
        name: (data as any).name,
        description: (data as any).description || '',
        permissions: (data as any).permissions,
        isSystemRole: (data as any).is_system_role,
        createdDate: new Date((data as any).created_at).toISOString().split('T')[0],
        updatedDate: new Date((data as any).updated_at).toISOString().split('T')[0]
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
        .from('roles')
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
