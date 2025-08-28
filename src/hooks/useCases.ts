import { useState, useEffect } from 'react';

export interface Case {
  id: string;
  title: string;
  client: string;
  status: "Open" | "In Progress" | "Pending" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  type: string;
  description: string;
}

// Mock data
const mockCases: Case[] = [
  {
    id: '1',
    title: 'Contract Review - ABC Corp',
    client: 'ABC Corporation',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'John Doe',
    createdDate: '2024-01-15',
    dueDate: '2024-01-25',
    type: 'Contract',
    description: 'Review and negotiate service agreement with ABC Corporation'
  },
  {
    id: '2',
    title: 'Employment Dispute - Smith vs XYZ',
    client: 'Jane Smith',
    status: 'Open',
    priority: 'Medium',
    assignedTo: 'Sarah Wilson',
    createdDate: '2024-01-10',
    dueDate: '2024-02-01',
    type: 'Employment',
    description: 'Handle employment discrimination case'
  },
  {
    id: '3',
    title: 'Patent Filing - Tech Innovation',
    client: 'Tech Innovations Inc',
    status: 'Closed',
    priority: 'Low',
    assignedTo: 'Mike Johnson',
    createdDate: '2024-01-05',
    dueDate: '2024-01-20',
    type: 'Intellectual Property',
    description: 'File patent application for new software algorithm'
  }
];

export function useCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCases([...mockCases]);
      setError(null);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: Omit<Case, "id" | "createdDate">) => {
    try {
      const newCase: Case = {
        ...caseData,
        id: `case-${Date.now()}`,
        createdDate: new Date().toISOString().split('T')[0]
      };

      setCases(prev => [newCase, ...prev]);
      return { success: true, data: newCase };
    } catch (err) {
      console.error('Error creating case:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create case' };
    }
  };

  const updateCase = async (caseId: string, caseData: Omit<Case, "id" | "createdDate">) => {
    try {
      const existingCase = cases.find(c => c.id === caseId);
      const updatedCase: Case = {
        ...caseData,
        id: caseId,
        createdDate: existingCase?.createdDate || new Date().toISOString().split('T')[0]
      };

      setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
      return { success: true, data: updatedCase };
    } catch (err) {
      console.error('Error updating case:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update case' };
    }
  };

  const deleteCase = async (caseId: string) => {
    try {
      setCases(prev => prev.filter(c => c.id !== caseId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting case:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete case' };
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    error,
    createCase,
    updateCase,
    deleteCase,
    refetch: fetchCases
  };
}