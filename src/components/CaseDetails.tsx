
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Edit2, Calendar, User, Clock, FileText } from "lucide-react";

interface Case {
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

interface CaseDetailsProps {
  case_item: Case;
  onBack: () => void;
  onEdit: (case_item: Case) => void;
}

export function CaseDetails({ case_item, onBack, onEdit }: CaseDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Pending": return "bg-orange-100 text-orange-800";
      case "Closed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-orange-100 text-orange-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger className="-ml-1" />
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Case Details</h1>
          </div>
          <Button onClick={() => onEdit(case_item)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Case
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Case Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{case_item.title}</h2>
            <p className="text-muted-foreground text-lg">{case_item.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(case_item.status)}>
              {case_item.status}
            </Badge>
            <Badge className={getPriorityColor(case_item.priority)}>
              {case_item.priority}
            </Badge>
          </div>
        </div>

        {/* Case Information Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <User className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{case_item.client}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <User className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">Assigned To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{case_item.assignedTo}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <FileText className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">Case Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{case_item.type}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">Created Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{case_item.createdDate}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Clock className="w-4 h-4 mr-2" />
              <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{case_item.dueDate}</div>
            </CardContent>
          </Card>
        </div>

        {/* Case Description */}
        <Card>
          <CardHeader>
            <CardTitle>Case Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {case_item.description}
            </p>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Case created</p>
                  <p className="text-xs text-muted-foreground">{case_item.createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Assigned to {case_item.assignedTo}</p>
                  <p className="text-xs text-muted-foreground">{case_item.createdDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Status updated to {case_item.status}</p>
                  <p className="text-xs text-muted-foreground">{case_item.createdDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
