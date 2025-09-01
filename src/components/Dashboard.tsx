
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Calendar,
  ClipboardList,
  RotateCcw,
  Timer,
  UserPlus,
  TicketPlus,
  BarChart3
} from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const chartData = [
  { name: 'Sept 10', active: 65, resolved: 85, overdue: 67 },
  { name: 'Sept 11', active: 32, resolved: 78, overdue: 77 },
  { name: 'Sept 12', active: 95, resolved: 25, overdue: 33 },
  { name: 'Sept 13', active: 48, resolved: 45, overdue: 55 },
  { name: 'Sept 14', active: 78, resolved: 85, overdue: 88 },
  { name: 'Sept 15', active: 92, resolved: 53, overdue: 56 },
  { name: 'Sept 16', active: 55, resolved: 85, overdue: 77 },
];

const pieData = [
  { name: 'Email', value: 12, color: '#dc2626' },
  { name: 'Web Forms', value: 50, color: '#f59e0b' },
];

const recentCases = [
  {
    caseId: 'Case-001',
    title: 'Login Failure',
    reportedBy: 'Darrell Steward',
    status: 'To Do',
    statusColor: 'bg-orange-100 text-orange-800',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800',
    assignee: 'Brooklyn Simmons',
    lastUpdated: '31-05-2024 16:27:54'
  },
  {
    caseId: 'Case-002', 
    title: 'Order History',
    reportedBy: 'Marvin McKinney',
    status: 'In Progress',
    statusColor: 'bg-blue-100 text-blue-800',
    priority: 'Urgent',
    priorityColor: 'bg-red-100 text-red-800',
    assignee: 'Kristin Watson',
    lastUpdated: '31-05-2024 16:27:54'
  },
  {
    caseId: 'Case-003',
    title: 'Payment Not Processing', 
    reportedBy: 'Courtney Henry',
    status: 'Active',
    statusColor: 'bg-green-100 text-green-800',
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-800',
    assignee: 'Jenny Wilson',
    lastUpdated: '31-05-2024 16:27:54'
  },
  {
    caseId: 'Case-004',
    title: 'Call Quality',
    reportedBy: 'Kristin Watson', 
    status: 'To Do',
    statusColor: 'bg-orange-100 text-orange-800',
    priority: 'Urgent',
    priorityColor: 'bg-red-100 text-red-800',
    assignee: 'Jane Cooper',
    lastUpdated: '31-05-2024 16:27:54'
  },
  {
    caseId: 'Case-005',
    title: 'Refund Request',
    reportedBy: 'Darlene Robertson',
    status: 'In Progress', 
    statusColor: 'bg-blue-100 text-blue-800',
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800',
    assignee: 'Marvin McKinney',
    lastUpdated: '31-05-2024 16:27:54'
  }
];

export function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Welcome</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">1</span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Here's what's happening with the cases today</h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workspace1">My Workspace</SelectItem>
              <SelectItem value="workspace2">Workstream A</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Workstream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stream1">Workstream A</SelectItem>
              <SelectItem value="stream2">Workstream B</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Brooklyn Simmons</SelectItem>
              <SelectItem value="agent2">Kristin Watson</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Apply
          </Button>
          <Button variant="outline" className="text-blue-600 border-blue-600">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Cases</p>
                  <p className="text-3xl font-bold">132</p>
                  <p className="text-sm text-green-600">+80 from the last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress Cases</p>
                  <p className="text-3xl font-bold">132</p>
                  <p className="text-sm text-red-600">+10 from the last month</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved Cases</p>
                  <p className="text-3xl font-bold">132</p>
                  <p className="text-sm text-green-600">+110 from the last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
                  <p className="text-3xl font-bold">00:15 <span className="text-sm font-normal">min</span></p>
                  <p className="text-sm text-red-600">+02 min from the last month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Resolution Time</p>
                  <p className="text-3xl font-bold">03:00 <span className="text-sm font-normal">Hrs</span></p>
                  <p className="text-sm text-green-600">+30 min from the last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second Row: Charts and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cases Progress Overview - Last 07 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="active" fill="#3b82f6" />
                  <Bar dataKey="resolved" fill="#10b981" />
                  <Bar dataKey="overdue" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cases By Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Web Forms</span>
                  </div>
                  <span className="text-sm font-medium">50</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Integrate Channel
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Customer
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TicketPlus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Third Row: Recent Cases Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Cases</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Case ID</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Reported By</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Assignee</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((case_item) => (
                    <tr key={case_item.caseId} className="border-b hover:bg-muted/50">
                      <td className="p-3 text-sm font-medium">{case_item.caseId}</td>
                      <td className="p-3 text-sm">{case_item.title}</td>
                      <td className="p-3 text-sm">{case_item.reportedBy}</td>
                      <td className="p-3">
                        <Badge className={`text-xs ${case_item.statusColor}`}>
                          {case_item.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={`text-xs ${case_item.priorityColor}`}>
                          {case_item.priority}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm">{case_item.assignee}</td>
                      <td className="p-3 text-sm text-muted-foreground">{case_item.lastUpdated}</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
