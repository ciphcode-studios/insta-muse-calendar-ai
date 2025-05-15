
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Instagram, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface InstagramCalendarFormProps {
  onFormSubmit: (formData: CalendarFormData) => void;
}

export interface CalendarFormData {
  calendarName: string; // Added calendarName
  postFrequency: string;
  targetAudience: string;
  contentDescription: string;
  postType: string; // Added for Gemini
  tone: string;     // Added for Gemini
}

const InstagramCalendarForm = ({ onFormSubmit }: InstagramCalendarFormProps) => {
  const { user } = useAuth();
  const [calendarName, setCalendarName] = useState(''); // Added state for calendarName
  const [postFrequency, setPostFrequency] = useState('weekly');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [postType, setPostType] = useState('Single Image'); // Added state for postType
  const [tone, setTone] = useState('Informative'); // Added state for tone
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calendarName || !targetAudience || !contentDescription || !postType || !tone) { // Added postType and tone to validation
      toast.error("Please fill out all fields, including calendar name, post type, and tone.");
      return;
    }
    
    setIsLoading(true);
    
    const formData = {
      calendarName, // Added calendarName to formData
      postFrequency,
      targetAudience,
      contentDescription,
      postType, // Added postType to formData
      tone      // Added tone to formData
    };
    
    try {
      // Save form data to Supabase if user is logged in
      if (user) {
        const { error } = await supabase.from('content_preferences').upsert({
          user_id: user.id,
          content_type: 'general', // Defaulting as instagramHandle is removed
          target_audience: targetAudience, 
          industry: contentDescription, 
          tone: postFrequency
        });
        
        if (error) {
          console.error('Error saving form data:', error);
          toast.error('Failed to save your preferences');
          setIsLoading(false);
          return;
        }
      }
      
      onFormSubmit(formData);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-3">
          <Instagram className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-center mt-4">
          Create Your Instagram Calendar
        </CardTitle>
        <CardDescription className="text-center">
          Provide us some details about your target audience, content type, and tone to generate a customized content calendar for your Instagram
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="calendarName" className="text-sm font-medium">Calendar Name</label>
            <Input
              id="calendarName"
              placeholder="E.g., My Awesome Instagram Plan"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="postFrequency" className="text-sm font-medium">Post Frequency</label>
            <Tabs defaultValue="weekly" className="w-full" onValueChange={setPostFrequency}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="3x weekly">3x Weekly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label htmlFor="postType" className="text-sm font-medium">Default Post Type</label>
            <Tabs defaultValue="Single Image" className="w-full" onValueChange={setPostType}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="Single Image">Single Image</TabsTrigger>
                <TabsTrigger value="Carousel">Carousel</TabsTrigger>
                <TabsTrigger value="Reel">Reel</TabsTrigger>
                <TabsTrigger value="Story">Story</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label htmlFor="tone" className="text-sm font-medium">Desired Tone</label>
            <Tabs defaultValue="Informative" className="w-full" onValueChange={setTone}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="Informative">Informative</TabsTrigger>
                <TabsTrigger value="Humorous">Humorous</TabsTrigger>
                <TabsTrigger value="Inspirational">Inspirational</TabsTrigger>
                <TabsTrigger value="Promotional">Promotional</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label htmlFor="contentDescription" className="text-sm font-medium">
              Briefly describe the type of content you want to publish
            </label>
            <Textarea
              id="contentDescription"
              placeholder="E.g., Fashion trends, fitness tips, food recipes..."
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              rows={6} 
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="targetAudience" className="text-sm font-medium">Choose your target audience</label>
            <Textarea
              id="targetAudience"
              placeholder="E.g., Young professionals, students, parents..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3} 
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Generating Calendar...</>
            ) : (
              <>
                <CalendarCheck className="mr-2 h-4 w-4" />
                Generate Content Calendar
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          We'll create personalized content suggestions based on your input
        </p>
      </CardFooter>
    </Card>
  );
};

export default InstagramCalendarForm;
