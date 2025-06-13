
import { 
  Home, 
  FileText, 
  Users, 
  Shield,
  Plus,
  UserCheck,
  Settings,
  Building2
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Cases",
    url: "/cases",
    icon: FileText,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UserCheck,
  },
  {
    title: "Workspaces",
    url: "/workspaces",
    icon: Building2,
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
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
