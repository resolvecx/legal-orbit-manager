
import { useState } from "react";
import { Users, Trash2, UserPlus, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkspaceMembersManager } from "@/components/WorkspaceMembersManager";
import type { Workspace } from "@/types/workspace";

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (id: string) => void;
}

export const WorkspaceCard = ({ workspace, onDelete }: WorkspaceCardProps) => {
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{workspace.name}</CardTitle>
            <CardDescription>{workspace.description || "No description"}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(workspace.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Manage Members
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Manage {workspace.name} Members</DialogTitle>
              </DialogHeader>
              <WorkspaceMembersManager 
                workspaceId={workspace.id}
                workspaceName={workspace.name}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Created {new Date(workspace.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
