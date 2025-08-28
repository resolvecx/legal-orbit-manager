import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { CaseForm } from "@/components/CaseForm";
import { CaseDetails } from "@/components/CaseDetails";
import { useCases, Case } from "@/hooks/useCases";
import { useToast } from "@/hooks/use-toast";

const Cases = () => {
  const { cases, loading, createCase, updateCase, deleteCase } = useCases();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [view, setView] = useState<"list" | "details">("list");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "In Progress": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Pending": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "Closed": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "High": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Medium": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "Low": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const filteredCases = cases.filter(case_item => {
    const matchesSearch = case_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || case_item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (formData: any) => {
    try {
      const result = await createCase({
        title: formData.title,
        client: formData.client,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        type: formData.type,
        description: formData.description
      });

      if (result.success) {
        setIsFormOpen(false);
        toast({
          title: "Success",
          description: "Case created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create case",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exception creating case:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!editingCase) return;

    try {
      const result = await updateCase(editingCase.id, {
        title: formData.title,
        client: formData.client,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        type: formData.type,
        description: formData.description
      });

      if (result.success) {
        setIsFormOpen(false);
        setEditingCase(null);
        toast({
          title: "Success",
          description: "Case updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update case",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exception updating case:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm("Are you sure you want to delete this case?")) {
      return;
    }

    try {
      const result = await deleteCase(caseId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Case deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete case",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exception deleting case:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleViewCase = (case_item: Case) => {
    setSelectedCase(case_item);
    setView("details");
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
                    <h1 className="text-lg font-semibold">Cases Management</h1>
                  </div>
                </div>   
              </header>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Loading cases...</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (view === "details" && selectedCase) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <CaseDetails 
              case_item={selectedCase} 
              onBack={() => setView("list")} 
              onEdit={(case_item) => {
                setEditingCase(case_item);
                setIsFormOpen(true);
                setView("list");
              }}
            />
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
                  <h1 className="text-lg font-semibold">Cases Management</h1>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </div>
            </header>

            {/* Filters and Search */}
            <div className="border-b border-border p-4">
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search cases..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-3 py-2 border rounded-md bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Cases Table */}
            <div className="flex-1 overflow-auto p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cases ({filteredCases.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCases.map((case_item) => (
                        <TableRow key={case_item.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{case_item.id}</TableCell>
                          <TableCell>{case_item.title}</TableCell>
                          <TableCell>{case_item.client}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(case_item.status)}>
                              {case_item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(case_item.priority)}>
                              {case_item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{case_item.assignedTo}</TableCell>
                          <TableCell>{case_item.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewCase(case_item)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingCase(case_item);
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(case_item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredCases.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "All" 
                          ? 'No cases found matching your filters.' 
                          : 'No cases found. Create your first case!'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Case Form Modal */}
          {isFormOpen && (
            <CaseForm 
              case_item={editingCase}
              onSubmit={editingCase ? handleUpdate : handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCase(null);
              }}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Cases;