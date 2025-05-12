
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
  name: string;
  instagramHandle: string;
  postFrequency: string;
  contentDescription: string;
}

const InstagramCalendarForm = ({ onFormSubmit }: InstagramCalendarFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [postFrequency, setPostFrequency] = useState('weekly');
  const [contentDescription, setContentDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !instagramHandle || !contentDescription) {
      toast.error("Please fill out all fields");
      return;
    }
    
    setIsLoading(true);
    
    const formData = {
      name,
      instagramHandle,
      postFrequency,
      contentDescription
    };
    
    try {
      // Save form data to Supabase if user is logged in
      if (user) {
        const { error } = await supabase.from('content_preferences').upsert({
          user_id: user.id,
          name,
          instagram_handle: instagramHandle,
          post_frequency: postFrequency,
          content_description: contentDescription
        });
        
        if (error) {
          console.error('Error saving form data:', error);
          toast.error('Failed to save your preferences');
          setIsLoading(false);
          return;
        }
      }
      
      onFormSubmit(formData);
      
      // Redirect to calendar page
      navigate('/calendar');
      
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
          Tell us about your Instagram content needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">What's Your Name?</label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="instagramHandle" className="text-sm font-medium">What's your Instagram handle?</label>
            <Input
              id="instagramHandle"
              placeholder="@yourhandle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
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
            <label htmlFor="contentDescription" className="text-sm font-medium">
              Briefly describe the type of content you want to publish
            </label>
            <Textarea
              id="contentDescription"
              placeholder="E.g., Fashion trends, fitness tips, food recipes..."
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              rows={4}
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
