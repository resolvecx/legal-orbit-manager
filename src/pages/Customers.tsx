import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "@/components/CustomerForm";
import { Customer } from "@/types/customer";
import { SupabaseCustomer, CustomerFormData } from "@/types/supabase-customer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  Building,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const convertSupabaseToCustomer = (supabaseCustomer: any): Customer => ({
    id: supabaseCustomer.id,
    name: supabaseCustomer.name,
    email: supabaseCustomer.email,
    phone: supabaseCustomer.phone,
    company: supabaseCustomer.company,
    address: supabaseCustomer.address,
    city: supabaseCustomer.city,
    state: supabaseCustomer.state,
    zipCode: supabaseCustomer.zip_code,
    status: supabaseCustomer.status as 'Active' | 'Inactive' | 'Prospect',
    customerType: supabaseCustomer.customer_type as 'Individual' | 'Business',
    assignedLawyer: supabaseCustomer.assigned_lawyer,
    notes: supabaseCustomer.notes,
    createdDate: supabaseCustomer.created_date,
    lastContact: supabaseCustomer.last_contact
  });

  const fetchCustomers = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching customers for user:', user.id);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched customers:', data);
      const convertedCustomers = data.map(convertSupabaseToCustomer);
      setCustomers(convertedCustomers);
    } catch (error) {
      console.error('Exception fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = async (customerData: Omit<Customer, "id" | "createdDate">) => {
    if (!user) return;

    try {
      console.log('Creating customer:', customerData);
      const supabaseData = {
        user_id: user.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || null,
        company: customerData.company || null,
        address: customerData.address || null,
        city: customerData.city || null,
        state: customerData.state || null,
        zip_code: customerData.zipCode || null,
        status: customerData.status,
        customer_type: customerData.customerType,
        assigned_lawyer: customerData.assignedLawyer || null,
        notes: customerData.notes || null,
        last_contact: customerData.lastContact || null
      };

      const { data, error } = await supabase
        .from('customers')
        .insert([supabaseData])
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        toast({
          title: "Error",
          description: "Failed to create customer",
          variant: "destructive",
        });
        return;
      }

      console.log('Created customer:', data);
      const newCustomer = convertSupabaseToCustomer(data);
      setCustomers([newCustomer, ...customers]);
      setIsFormOpen(false);
      toast({
        title: "Customer created",
        description: "The customer has been successfully created.",
      });
    } catch (error) {
      console.error('Exception creating customer:', error);
    }
  };

  const handleUpdateCustomer = async (customerData: Omit<Customer, "id" | "createdDate">) => {
    if (!selectedCustomer || !user) return;
    
    try {
      console.log('Updating customer:', selectedCustomer.id, customerData);
      const supabaseData = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || null,
        company: customerData.company || null,
        address: customerData.address || null,
        city: customerData.city || null,
        state: customerData.state || null,
        zip_code: customerData.zipCode || null,
        status: customerData.status,
        customer_type: customerData.customerType,
        assigned_lawyer: customerData.assignedLawyer || null,
        notes: customerData.notes || null,
        last_contact: customerData.lastContact || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('customers')
        .update(supabaseData)
        .eq('id', selectedCustomer.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: "Failed to update customer",
          variant: "destructive",
        });
        return;
      }

      console.log('Updated customer:', data);
      const updatedCustomer = convertSupabaseToCustomer(data);
      setCustomers(customers.map(customer =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      ));
      setSelectedCustomer(null);
      setIsFormOpen(false);
      setIsEditing(false);
      toast({
        title: "Customer updated",
        description: "The customer has been successfully updated.",
      });
    } catch (error) {
      console.error('Exception updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!user) return;

    try {
      console.log('Deleting customer:', customerId);
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting customer:', error);
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        });
        return;
      }

      console.log('Deleted customer:', customerId);
      setCustomers(customers.filter(customer => customer.id !== customerId));
      toast({
        title: "Customer deleted",
        description: "The customer has been successfully deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Exception deleting customer:', error);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCustomer(null);
    setIsEditing(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Prospect":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex flex-col h-screen">
              <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center gap-4 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <div className="flex-1">
                    <h1 className="text-lg font-semibold">Customer Profiles</h1>
                  </div>
                </div>
              </header>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Loading customers...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center gap-4 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                  <h1 className="text-lg font-semibold">Customer Profiles</h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search customers..." 
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Customer
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{customer.name}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(customer.status)} className="text-xs">
                            {customer.status}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border z-50">
                            <DropdownMenuItem onClick={() => handleEditClick(customer)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.company && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-4 h-4" />
                            <span className="truncate">{customer.company}</span>
                          </div>
                        )}
                        {customer.city && customer.state && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{customer.city}, {customer.state}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Type: {customer.customerType}</span>
                          <span>Created: {customer.createdDate}</span>
                        </div>
                        {customer.assignedLawyer && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Lawyer: {customer.assignedLawyer}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCustomers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No customers found matching your search.' : 'No customers found. Create your first customer!'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {isFormOpen && (
            <CustomerForm
              customer={isEditing ? selectedCustomer : null}
              onSubmit={isEditing ? handleUpdateCustomer : handleCreateCustomer}
              onCancel={handleCloseForm}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
