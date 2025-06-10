
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";

const cases = [
  {
    id: "2024-001",
    title: "Johnson vs. Smith",
    client: "Sarah Johnson",
    status: "Active",
    priority: "High",
    lastUpdate: "2 hours ago",
    type: "Personal Injury"
  },
  {
    id: "2024-002", 
    title: "Estate Planning - Davis",
    client: "Michael Davis",
    status: "Review",
    priority: "Medium",
    lastUpdate: "1 day ago",
    type: "Estate"
  },
  {
    id: "2024-003",
    title: "Corporate Merger",
    client: "TechCorp Inc.",
    status: "Active",
    priority: "High",
    lastUpdate: "3 hours ago",
    type: "Corporate"
  },
  {
    id: "2024-004",
    title: "Divorce Settlement",
    client: "Emily Wilson",
    status: "Pending",
    priority: "Low",
    lastUpdate: "5 days ago",
    type: "Family"
  },
  {
    id: "2024-005",
    title: "Contract Dispute",
    client: "ABC Manufacturing",
    status: "Discovery",
    priority: "Medium",
    lastUpdate: "1 day ago",
    type: "Commercial"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Review": return "bg-yellow-100 text-yellow-800";
    case "Pending": return "bg-gray-100 text-gray-800";
    case "Discovery": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800";
    case "Medium": return "bg-orange-100 text-orange-800";
    case "Low": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export function CasesList() {
  return (
    <div className="space-y-4">
      {cases.map((case_item) => (
        <div 
          key={case_item.id} 
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">{case_item.title}</h4>
              <Badge variant="outline" className="text-xs">
                {case_item.id}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Client: {case_item.client}</span>
              <span>•</span>
              <span>{case_item.type}</span>
              <span>•</span>
              <span>Updated {case_item.lastUpdate}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(case_item.status)} border-0`}>
              {case_item.status}
            </Badge>
            <Badge className={`${getPriorityColor(case_item.priority)} border-0`}>
              {case_item.priority}
            </Badge>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
