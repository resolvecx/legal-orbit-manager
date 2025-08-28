import { useState, useEffect } from 'react';
import { Customer } from '@/types/customer';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    email: 'contact@abccorp.com',
    phone: '555-0100',
    company: 'ABC Corporation',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    status: 'Active',
    customerType: 'Business',
    assignedLawyer: 'John Doe',
    notes: 'Major client, handles multiple contracts annually',
    createdDate: '2024-01-15',
    lastContact: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@personal.com',
    phone: '555-0200',
    company: '',
    address: '456 Residential St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    status: 'Active',
    customerType: 'Individual',
    assignedLawyer: 'Sarah Wilson',
    notes: 'Employment law case, very responsive client',
    createdDate: '2024-01-10',
    lastContact: '2024-01-18'
  },
  {
    id: '3',
    name: 'Tech Innovations Inc',
    email: 'legal@techinnovations.com',
    phone: '555-0300',
    company: 'Tech Innovations Inc',
    address: '789 Tech Park Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    status: 'Prospect',
    customerType: 'Business',
    assignedLawyer: 'Mike Johnson',
    notes: 'Potential client for IP services',
    createdDate: '2024-01-05',
    lastContact: '2024-01-12'
  }
];

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      setCustomers([...mockCustomers]);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Omit<Customer, "id" | "createdDate">) => {
    try {
      const newCustomer: Customer = {
        ...customerData,
        id: `customer-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0]
      };

      setCustomers(prev => [newCustomer, ...prev]);
      return { success: true, data: newCustomer };
    } catch (err) {
      console.error('Error creating customer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create customer' };
    }
  };

  const updateCustomer = async (customerId: string, customerData: Omit<Customer, "id" | "createdDate">) => {
    try {
      const existingCustomer = customers.find(c => c.id === customerId);
      const updatedCustomer: Customer = {
        ...customerData,
        id: customerId,
        createdDate: existingCustomer?.createdDate || new Date().toISOString().split('T')[0]
      };

      setCustomers(prev => prev.map(c => c.id === customerId ? updatedCustomer : c));
      return { success: true, data: updatedCustomer };
    } catch (err) {
      console.error('Error updating customer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update customer' };
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting customer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete customer' };
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers
  };
}