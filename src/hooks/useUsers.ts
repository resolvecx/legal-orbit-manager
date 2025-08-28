import { useState, useEffect } from 'react';
import { User } from '@/types/user';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    roleId: 'admin',
    department: 'Legal',
    phone: '555-0123',
    status: 'Active',
    createdDate: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    roleId: 'manager',
    department: 'Operations',
    phone: '555-0124',
    status: 'Active',
    createdDate: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    roleId: 'user',
    department: 'Support',
    phone: '555-0125',
    status: 'Inactive',
    createdDate: '2024-01-05',
    lastLogin: '2024-01-18'
  }
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers([...mockUsers]);
      setError(null);
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
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0]
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
      const updatedUser: User = {
        ...userData,
        id: userId,
        createdDate: users.find(u => u.id === userId)?.createdDate || new Date().toISOString().split('T')[0]
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