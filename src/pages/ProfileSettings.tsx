
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import UserRegistration from '@/components/UserRegistration';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { UserData } from '@/components/UserRegistration';

const ProfileSettings = () => {
  const { user, updateUserMetadata } = useAuth();

  const handleProfileUpdate = async (userData: UserData) => {
    if (!user) return;
    
    try {
      await updateUserMetadata({
        username: userData.username
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <UserRegistration onRegistrationComplete={handleProfileUpdate} />
      </div>
    </MainLayout>
  );
};

export default ProfileSettings;
