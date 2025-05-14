
import React from 'react';
import ContentPreferences, { ContentPreference } from "@/components/ContentPreferences";
import { useAuth } from '@/context/AuthContext';

interface PreferencesStepProps {
  onPreferenceSubmit: (prefs: ContentPreference) => Promise<void>;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ onPreferenceSubmit }) => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.user_metadata?.username || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Let's create your personalized content calendar
        </p>
      </div>
      <ContentPreferences onPreferenceSubmit={onPreferenceSubmit} />
    </>
  );
};

export default PreferencesStep;
