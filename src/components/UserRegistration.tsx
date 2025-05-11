
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

interface UserRegistrationProps {
  onRegistrationComplete: (userData: UserData) => void;
}

export interface UserData {
  username: string;
  email: string;
  password: string;
}

const UserRegistration = ({ onRegistrationComplete }: UserRegistrationProps) => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.user_metadata?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email) {
      toast.error("Username and email are required");
      return;
    }
    
    setIsLoading(true);
    
    // If user is authenticated, we don't need the password
    const userData = {
      username,
      email,
      password: '' // We don't store or pass the actual password
    };
    
    setTimeout(() => {
      toast.success("Profile updated!");
      setIsLoading(false);
      onRegistrationComplete(userData);
    }, 500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-3">
          <Instagram className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-center mt-4">Your Profile</CardTitle>
        <CardDescription className="text-center">
          Update your account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input
              id="username"
              placeholder="@yourname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              readOnly
              disabled
              className="bg-gray-50"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Your profile information is securely stored
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserRegistration;
