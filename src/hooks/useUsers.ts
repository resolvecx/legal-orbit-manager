
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
      const { data, error } = await supabase
        .from('app_users')
        .select(`
          *,
          roles:role_id (
            id,
            name
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.role_id || '',
        department: user.department,
        phone: user.phone || '',
        status: user.status as "Active" | "Inactive",
        createdDate: new Date(user.created_at).toISOString().split('T')[0],
        lastLogin: user.last_login || ''
      }));

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
        .from('app_users')
        .insert({
          name: userData.name,
          email: userData.email,
          role_id: userData.roleId,
          department: userData.department,
          phone: userData.phone || null,
          status: userData.status,
          last_login: userData.lastLogin ? new Date(userData.lastLogin).toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        roleId: data.role_id || '',
        department: data.department,
        phone: data.phone || '',
        status: data.status as "Active" | "Inactive",
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        lastLogin: data.last_login || ''
      };

      setUsers(prev => [...prev, newUser]);
      return { success: true };
    } catch (err) {
      console.error('Error creating user:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create user' };
    }
  };

  const updateUser = async (userId: string, userData: Omit<User, "id" | "createdDate">) => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .update({
          name: userData.name,
          email: userData.email,
          role_id: userData.roleId,
          department: userData.department,
          phone: userData.phone || null,
          status: userData.status,
          last_login: userData.lastLogin ? new Date(userData.lastLogin).toISOString() : null,
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
        roleId: data.role_id || '',
        department: data.department,
        phone: data.phone || '',
        status: data.status as "Active" | "Inactive",
        createdDate: new Date(data.created_at).toISOString().split('T')[0],
        lastLogin: data.last_login || ''
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
        .from('app_users')
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
