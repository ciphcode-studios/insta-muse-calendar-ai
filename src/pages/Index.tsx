import React, { useState } from 'react';
import UserRegistration, { UserData } from "@/components/UserRegistration";
import ContentPreferences, { ContentPreference } from "@/components/ContentPreferences";
import ContentCalendar, { PostSuggestion } from "@/components/ContentCalendar";
import { generateContentCalendar } from "@/services/contentGenerator";
import { Toaster } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Instagram, Calendar, Image, ArrowRight } from "lucide-react";

enum Step {
  Registration,
  Preferences,
  Calendar,
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Registration);
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
      const generatedPosts = await generateContentCalendar(prefs);
      setPosts(generatedPosts);
      setCurrentStep(Step.Calendar);
    } catch (error) {
      console.error("Error generating content calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(Step.Preferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Toaster />
      <header className="px-4 py-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-2">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Insta Content Planner
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Card className="w-full max-w-md mx-auto p-6">
            <CardHeader className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-bold mt-4">Generating your content calendar...</h2>
              <p className="text-center text-muted-foreground mt-2">
                Our AI is creating personalized post suggestions based on your preferences.
              </p>
            </CardHeader>
          </Card>
        ) : (
          <>
            {currentStep === Step.Registration && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold">Create Your Instagram Content Calendar</h1>
                  <p className="text-muted-foreground mt-2">
                    Get AI-powered content suggestions tailored to your brand
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <UserRegistration onRegistrationComplete={handleRegistrationComplete} />
                  </div>
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <h2 className="text-xl font-bold">Why use Insta Content Planner?</h2>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-full p-1">
                            <Calendar className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Save Time Planning</h3>
                            <p className="text-sm text-muted-foreground">
                              Generate a month's worth of content ideas in seconds
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-full p-1">
                            <Image className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">AI Image Prompts</h3>
                            <p className="text-sm text-muted-foreground">
                              Get creative image ideas that align with your brand
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-full p-1">
                            <ArrowRight className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Consistent Growth</h3>
                            <p className="text-sm text-muted-foreground">
                              Post regularly with engaging content to grow your audience
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {currentStep === Step.Preferences && userData && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold">
                    Welcome, @{userData.username}!
                  </h1>
                  <p className="text-muted-foreground">
                    Let's create your personalized content calendar
                  </p>
                </div>
                <ContentPreferences onPreferenceSubmit={handlePreferenceSubmit} />
              </>
            )}

            {currentStep === Step.Calendar && posts.length > 0 && (
              <ContentCalendar posts={posts} onBack={handleBack} />
            )}
          </>
        )}
      </main>

      <footer className="mt-16 border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 Insta Content Planner. All rights reserved.</p>
          <p className="mt-2">Not affiliated with Instagram.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
