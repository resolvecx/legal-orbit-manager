
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceForm } from "@/components/WorkspaceForm";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Workspace } from "@/types/workspace";

const Workspaces = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Workspace[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (workspace: { name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('workspaces')
        .insert(workspace)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsCreateDialogOpen(false);
      toast.success("Workspace created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create workspace");
      console.error('Error creating workspace:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success("Workspace deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete workspace");
      console.error('Error deleting workspace:', error);
    }
  });

  const handleCreate = (data: { name: string; description?: string }) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this workspace? This will also remove all members.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Workspaces</h1>
              <p className="text-muted-foreground">Manage departments and team workspaces</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                </DialogHeader>
                <WorkspaceForm 
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workspaces && workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <WorkspaceCard 
                  key={workspace.id} 
                  workspace={workspace}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">🏢</div>
                <CardTitle className="mb-2">No workspaces yet</CardTitle>
                <CardDescription className="text-center mb-4">
                  Create your first workspace to start organizing your teams and departments.
                </CardDescription>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Workspace
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Workspace</DialogTitle>
                    </DialogHeader>
                    <WorkspaceForm 
                      onSubmit={handleCreate}
                      onCancel={() => setIsCreateDialogOpen(false)}
                      isLoading={createMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Workspaces;
