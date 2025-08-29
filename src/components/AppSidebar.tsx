
import { 
  Home, 
  FileText, 
  Users, 
  Shield,
  Plus,
  UserCheck,
  Settings,
  Building2,
  Mail,
  ChevronDown,
  Circle,
  BarChart3
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox", 
    url: "/inbox",
    icon: Mail,
  },
];

const userManagementItems = [
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
  },
];

const workspaceItems = [
  {
    title: "Workstream A",
    url: "/workstream-a",
    icon: Circle,
    color: "text-purple-500",
  },
  {
    title: "Workstream B", 
    url: "/workstream-b",
    icon: Circle,
    color: "text-blue-500",
  },
  {
    title: "Workstream C",
    url: "/workstream-c", 
    icon: Circle,
    color: "text-orange-500",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Resolve CX</h2>
            <p className="text-xs text-muted-foreground">Case Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Management */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="h-10 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">User Management</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {userManagementItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild className="h-8 px-6 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                        <a href={item.url} className="flex items-center gap-3">
                          <item.icon className="w-3 h-3" />
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>

        {/* Other Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                  <a href="/customers" className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4" />
                    <span className="font-medium">Customers</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                  <a href="/audit-logs" className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">Audit Logs</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Workspaces */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">
            Workspaces
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-8 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                  <a href="/my-workspace" className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">W</span>
                    </div>
                    <span className="text-sm font-medium">My Workspace</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-8 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
                    <a href={item.url} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${
                        item.color === 'text-purple-500' ? 'bg-purple-500' :
                        item.color === 'text-blue-500' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}>
                        <item.icon className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-8 px-3 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground">
                  <a href="/workspaces" className="flex items-center gap-3">
                    <span className="text-sm">View All Workspaces</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3 rounded-lg hover:bg-accent text-sidebar-foreground hover:text-accent-foreground">
              <a href="#" className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
