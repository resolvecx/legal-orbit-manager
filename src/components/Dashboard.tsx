
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  Search,
  Filter,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { StatsCards } from "@/components/StatsCards";
import { CasesList } from "@/components/CasesList";
import UserMenu from "@/components/UserMenu";

export function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search cases..." 
                className="pl-8 w-64"
              />
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here's what's happening with your cases today.
            </p>
          </div>
        </div>

        <StatsCards />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>
                    Your most recently updated cases
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CasesList />
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Important dates coming up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Motion Filing</p>
                    <p className="text-xs text-muted-foreground">Case #2024-001</p>
                  </div>
                  <Badge variant="destructive">Tomorrow</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Client Meeting</p>
                    <p className="text-xs text-muted-foreground">Johnson vs. Smith</p>
                  </div>
                  <Badge variant="secondary">3 days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Discovery Due</p>
                    <p className="text-xs text-muted-foreground">Case #2024-003</p>
                  </div>
                  <Badge variant="outline">1 week</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
