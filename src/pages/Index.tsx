
import React, { useState } from 'react';
import { UserData } from "@/components/UserRegistration";
import ContentCalendar, { PostSuggestion } from "@/components/ContentCalendar";
import InstagramCalendarForm, { CalendarFormData } from "@/components/InstagramCalendarForm";
import { generateContentCalendar } from "@/services/contentGenerator";
import { generateImagePrompts, GeminiRequestPayload } from '@/services/geminiService'; // Added import for Gemini service
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
  const [calendarName, setCalendarName] = useState<string>('');
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
          calendar_name: calendarName, // Save calendar name
          target_audience: prefs.targetAudience,
          industry: prefs.description,
          // tone: prefs.tone, // 'tone' is not part of ContentPreference, so cannot be saved here unless added
          post_frequency: prefs.postFrequency // Correctly map to post_frequency column
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
    setIsLoading(true);
    setCalendarName(formData.calendarName); 

    const contentPrefs: ContentPreference = {
      contentTypes: ['lifestyle'], 
      targetAudience: formData.targetAudience,
      description: formData.contentDescription,
      postFrequency: formData.postFrequency as any
    };
    
    try {
      // 1. Generate initial posts (day, date, time, mock imagePrompt, caption)
      const initialPosts = await generateContentCalendar(contentPrefs);

      // 2. Prepare payload for Gemini AI
      const geminiPayload: GeminiRequestPayload = {
        contentDescription: formData.contentDescription,
        targetAudience: formData.targetAudience,
        postType: formData.postType, 
        tone: formData.tone,
        // brandKeywords, negativeKeywords, imageStyle can be added later if form is extended
      };

      // 3. Call Gemini service to get image prompts
      toast.info("Generating AI image prompts...");
      const geminiResponse = await generateImagePrompts(geminiPayload);

      if (geminiResponse.error || !geminiResponse.prompts || geminiResponse.prompts.length === 0) {
        toast.error(geminiResponse.error || 'Failed to generate image prompts from AI. Using default prompts.');
        setPosts(initialPosts);
      } else {
        // 4. Merge AI prompts with initial posts
        const finalPosts = initialPosts.map((post, index) => ({
          ...post,
          // Cycle through Gemini prompts if there are more posts than prompts
          // Fallback to original mock prompt if Gemini prompt is undefined
          imagePrompt: geminiResponse.prompts[index % geminiResponse.prompts.length]?.prompt || post.imagePrompt,
        }));
        setPosts(finalPosts);
        toast.success("AI image prompts generated and applied!");
      }

      // Save preferences to Supabase (if user is logged in)
      if (user) {
        const { error: prefError } = await supabase.from('content_preferences').upsert({
          user_id: user.id,
          content_type: contentPrefs.contentTypes.join(','), // Defaulted to ['lifestyle']
          calendar_name: formData.calendarName,
          target_audience: formData.targetAudience,
          industry: formData.contentDescription,
          tone: formData.tone, // Correctly save form's tone
          post_frequency: formData.postFrequency, // Correctly save form's postFrequency
          post_type: formData.postType // Save postType as well
        });
        
        if (prefError) {
          console.error('Error saving preferences:', prefError);
          toast.error('Failed to save your preferences');
          // Don't block UI for this, calendar is generated
        }
      }
      
      setCurrentStep(Step.Calendar);
    } catch (error) {
      console.error("Error in calendar generation process:", error);
      toast.error('Failed to generate content calendar or image prompts.');
      // Fallback to initial posts if any error occurs during Gemini integration or main generation
      // This ensures user at least sees something if AI part fails
      const fallbackPosts = await generateContentCalendar(contentPrefs).catch(() => []);
      setPosts(fallbackPosts);
      if (fallbackPosts.length > 0) setCurrentStep(Step.Calendar);
    } finally {
      setIsLoading(false);
    }
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
            <ContentCalendar posts={posts} onBack={handleBack} calendarName={calendarName} />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default Index;
