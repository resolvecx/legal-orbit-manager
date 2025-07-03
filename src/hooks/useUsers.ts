
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Use raw query since app_users table is not in generated types yet
      const { data, error } = await supabase
        .from('app_users' as any)
        .select(`
          *,
          roles!inner(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        // Set mock data as fallback
        setUsers([
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@lawfirm.com',
            roleId: '1',
            department: 'Administration',
            phone: '+1 (555) 123-4567',
            status: 'Active',
            createdDate: '2024-06-11',
            lastLogin: '2024-06-11T10:30:00Z'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@lawfirm.com',
            roleId: '2',
            department: 'Litigation',
            phone: '+1 (555) 234-5678',
            status: 'Active',
            createdDate: '2024-06-11',
            lastLogin: '2024-06-11T09:15:00Z'
          }
        ]);
        return;
      }

      const formattedUsers: User[] = data?.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.role_id,
        department: user.department,
        phone: user.phone,
        status: user.status,
        createdDate: new Date(user.created_at).toISOString().split('T')[0],
        lastLogin: user.last_login
      })) || [];

      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, "id" | "createdDate">) => {
    try {
      const { data, error } = await supabase
        .from('app_users' as any)
        .insert({
          name: userData.name,
          email: userData.email,
          role_id: userData.roleId,
          department: userData.department,
          phone: userData.phone,
          status: userData.status,
          last_login: userData.lastLogin
        })
        .select()
        .single();

      if (error) throw error;

      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        roleId: data.role_id,
        department: data.department,
        phone: data.phone,
        status: data.status,
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        lastLogin: data.last_login
      };

      setUsers(prev => [newUser, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Error creating user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create user' };
    }
  };

  const updateUser = async (userId: string, userData: Omit<User, "id" | "createdDate">) => {
    try {
      const { data, error } = await supabase
        .from('app_users' as any)
        .update({
          name: userData.name,
          email: userData.email,
          role_id: userData.roleId,
          department: userData.department,
          phone: userData.phone,
          status: userData.status,
          last_login: userData.lastLogin,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        roleId: data.role_id,
        department: data.department,
        phone: data.phone,
        status: data.status,
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        lastLogin: data.last_login
      };

      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      return { success: true };
    } catch (err) {
      console.error('Error updating user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update user' };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('app_users' as any)
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete user' };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers
  };
}
