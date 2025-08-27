import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bell, Mail, Smartphone } from 'lucide-react';

interface NotificationSetting {
  id: string;
  name: string;
  inApp: boolean;
  email: boolean;
  push: boolean;
}

const Settings = () => {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: '1', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '2', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '3', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '4', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '5', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '6', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '7', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '8', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '9', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '10', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '11', name: 'Comment and Reactions', inApp: false, email: true, push: false },
    { id: '12', name: 'Comment and Reactions', inApp: false, email: true, push: false },
  ]);

  const updateNotification = (id: string, type: 'inApp' | 'email' | 'push', value: boolean) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, [type]: value } : notif
      )
    );
  };

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Settings updated:', notifications);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to main
                  </Button>
                  <h1 className="text-2xl font-bold text-primary">ResolveCX</h1>
                </div>
                <div className="text-lg font-medium">Welcome!</div>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Left Sidebar */}
              <div className="w-64 bg-muted/30 border-r p-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-muted-foreground mb-4">SETTINGS</div>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Company Name
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Company Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    General Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Workspaces
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Users
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Permissions
                  </Button>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="font-medium text-sm">William</div>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    My Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Working Status
                  </Button>
                  <Button variant="default" className="w-full justify-start text-sm">
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                <div className="max-w-4xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <Button variant="link" className="text-primary">
                      Reset to Default Settings.
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Choose how will your notifications reach you.
                  </p>

                  <div className="mb-4">
                    <Select defaultValue="default">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="urgent">Urgent Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/50">
                        <div></div>
                        <div className="text-center font-medium flex items-center justify-center gap-2">
                          <Bell className="h-4 w-4" />
                          In App
                        </div>
                        <div className="text-center font-medium flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                        <div className="text-center font-medium flex items-center justify-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Push
                        </div>
                      </div>

                      {/* General Notifications Section */}
                      <div className="border-b">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/20">
                          <div className="font-medium">
                            <div>General Notifications</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              All notifications from your profile.
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                        </div>

                        {notifications.slice(0, 5).map((notification) => (
                          <div key={notification.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                            <div className="pl-4">{notification.name}</div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.inApp}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'inApp', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.email}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'email', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.push}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'push', checked as boolean)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Second General Notifications Section */}
                      <div className="border-b">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/20">
                          <div className="font-medium">
                            <div>General Notifications</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              All notifications from your profile.
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                        </div>

                        {notifications.slice(5, 10).map((notification) => (
                          <div key={notification.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                            <div className="pl-4">{notification.name}</div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.inApp}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'inApp', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.email}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'email', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.push}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'push', checked as boolean)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Third General Notifications Section */}
                      <div>
                        <div className="grid grid-cols-4 gap-4 p-4 bg-muted/20">
                          <div className="font-medium">
                            <div>General Notifications</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              All notifications from your profile.
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                          <div className="flex justify-center">
                            <Checkbox />
                          </div>
                        </div>

                        {notifications.slice(10).map((notification) => (
                          <div key={notification.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                            <div className="pl-4">{notification.name}</div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.inApp}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'inApp', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.email}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'email', checked as boolean)
                                }
                              />
                            </div>
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={notification.push}
                                onCheckedChange={(checked) => 
                                  updateNotification(notification.id, 'push', checked as boolean)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end mt-6">
                    <Button onClick={handleUpdate} className="px-12">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;