
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return null;
  }
  
  const username = user.user_metadata?.username || user.email?.split('@')[0];
  const initials = username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.user_metadata?.avatar_url} alt={username} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <Link to="/profile" className="text-sm font-medium hidden md:inline hover:underline">{username}</Link>
      <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;
