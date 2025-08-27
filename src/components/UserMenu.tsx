
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (!user) return null;

  const userInitials = profile?.full_name?.substring(0, 2).toUpperCase() || 
                      user.email?.substring(0, 2).toUpperCase() || 'U';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-red-600';
      case 'admin':
        return 'text-orange-600';
      case 'manager':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{profile?.full_name || 'User'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {profile?.role && (
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span className={`text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
                  {profile.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
          <User className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
