
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "@/components/CustomerForm";
import { Customer } from "@/types/customer";
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

const mockCustomers: Customer[] = [
  {
    id: "customer-1",
    name: "Robert Johnson",
    email: "robert.johnson@email.com",
    phone: "(555) 123-4567",
    company: "Johnson Enterprises",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    status: "Active",
    customerType: "Business",
    assignedLawyer: "John Smith",
    notes: "Regular client for business law matters",
    createdDate: "2024-01-15",
    lastContact: "2024-12-01"
  },
  {
    id: "customer-2",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "(555) 234-5678",
    company: "",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    status: "Active",
    customerType: "Individual",
    assignedLawyer: "Sarah Johnson",
    notes: "Family law case - divorce proceedings",
    createdDate: "2024-02-20",
    lastContact: "2024-11-28"
  },
  {
    id: "customer-3",
    name: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "(555) 345-6789",
    company: "Tech Solutions Inc",
    address: "789 Innovation Dr",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    status: "Prospect",
    customerType: "Business",
    assignedLawyer: "Michael Davis",
    notes: "Potential corporate restructuring client",
    createdDate: "2024-03-10",
    lastContact: "2024-12-05"
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCustomer = (customerData: Omit<Customer, "id" | "createdDate">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `customer-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
    setIsFormOpen(false);
    toast({
      title: "Customer created",
      description: "The customer has been successfully created.",
    });
  };

  const handleUpdateCustomer = (customerData: Omit<Customer, "id" | "createdDate">) => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.map(customer =>
      customer.id === selectedCustomer.id
        ? { ...customer, ...customerData }
        : customer
    );
    setCustomers(updatedCustomers);
    setSelectedCustomer(null);
    setIsFormOpen(false);
    setIsEditing(false);
    toast({
      title: "Customer updated",
      description: "The customer has been successfully updated.",
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
    toast({
      title: "Customer deleted",
      description: "The customer has been successfully deleted.",
      variant: "destructive",
    });
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

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No customers found.</p>
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
