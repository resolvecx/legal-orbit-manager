
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkspaceFormProps {
  onSubmit: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: { name: string; description?: string };
}

export const WorkspaceForm = ({ onSubmit, onCancel, isLoading, initialData }: WorkspaceFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({ 
      name: name.trim(), 
      description: description.trim() || undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Legal Department, HR Team"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this workspace"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !name.trim()}>
          {isLoading ? "Creating..." : "Create Workspace"}
        </Button>
      </div>
    </form>
  );
};
