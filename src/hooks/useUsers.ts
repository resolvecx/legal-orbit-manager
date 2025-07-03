
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
        .from('app_users' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
        return;
      }

      if (data) {
        const formattedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.role_id,
          department: user.department,
          phone: user.phone,
          status: user.status,
          createdDate: new Date(user.created_at).toISOString().split('T')[0],
          lastLogin: user.last_login
        }));

        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
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
