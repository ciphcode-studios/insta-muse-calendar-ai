
import React, { useState } from 'react';
import { UserData } from "@/components/UserRegistration";
import ContentCalendar, { PostSuggestion } from "@/components/ContentCalendar";
import InstagramCalendarForm, { CalendarFormData } from "@/components/InstagramCalendarForm";
import { generateContentCalendar } from "@/services/contentGenerator";
import { ContentPreference } from "@/components/ContentPreferences";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import LoadingCard from '@/components/ui/LoadingCard';
import RegistrationStep from '@/components/steps/RegistrationStep';
import PreferencesStep from '@/components/steps/PreferencesStep';

enum Step {
  CalendarForm,
  Registration,
  Preferences,
  Calendar,
}

const Index = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(Step.CalendarForm);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preferences, setPreferences] = useState<ContentPreference | null>(null);
  const [posts, setPosts] = useState<PostSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationComplete = (data: UserData) => {
    setUserData(data);
    setCurrentStep(Step.Preferences);
  };

  const handlePreferenceSubmit = async (prefs: ContentPreference) => {
    setPreferences(prefs);
    setIsLoading(true);
    
    try {
      // Save preferences to Supabase
      if (user) {
        const { error } = await supabase.from('content_preferences').upsert({
          user_id: user.id,
          content_type: prefs.contentTypes.join(','),
          target_audience: prefs.targetAudience,
          industry: prefs.description,
          tone: prefs.postFrequency
        });
        
        if (error) {
          console.error('Error saving preferences:', error);
          toast.error('Failed to save preferences');
        }
      }
      
      const generatedPosts = await generateContentCalendar(prefs);
      setPosts(generatedPosts);
      setCurrentStep(Step.Calendar);
    } catch (error) {
      console.error("Error generating content calendar:", error);
      toast.error('Failed to generate content calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalendarFormSubmit = async (formData: CalendarFormData) => {
    // Convert form data to ContentPreference format
    const contentPrefs: ContentPreference = {
      contentTypes: ['lifestyle'], // Default content type
      targetAudience: formData.name,
      description: formData.contentDescription,
      postFrequency: formData.postFrequency as any
    };
    
    await handlePreferenceSubmit(contentPrefs);
  };

  const handleBack = () => {
    setCurrentStep(Step.Preferences);
  };

  return (
    <MainLayout>
      {isLoading ? (
        <LoadingCard />
      ) : (
        <>
          {user && currentStep === Step.CalendarForm && (
            <InstagramCalendarForm onFormSubmit={handleCalendarFormSubmit} />
          )}

          {(!user || currentStep === Step.Registration) && (
            <RegistrationStep onRegistrationComplete={handleRegistrationComplete} />
          )}

          {currentStep === Step.Preferences && (
            <PreferencesStep onPreferenceSubmit={handlePreferenceSubmit} />
          )}

          {currentStep === Step.Calendar && posts.length > 0 && (
            <ContentCalendar posts={posts} onBack={handleBack} />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Index;
