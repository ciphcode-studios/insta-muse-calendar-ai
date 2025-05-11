
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export interface ContentPreference {
  contentTypes: string[];
  description: string;
  postFrequency: string;
  targetAudience: string;
}

interface ContentPreferencesProps {
  onPreferenceSubmit: (preferences: ContentPreference) => void;
}

const ContentPreferences = ({ onPreferenceSubmit }: ContentPreferencesProps) => {
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [postFrequency, setPostFrequency] = useState('daily');
  const [targetAudience, setTargetAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contentOptions = [
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'food', label: 'Food & Cooking' },
    { id: 'travel', label: 'Travel' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'tech', label: 'Technology' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'business', label: 'Business & Entrepreneurship' }
  ];

  const handleContentTypeChange = (value: string) => {
    setContentTypes(prev => 
      prev.includes(value) 
        ? prev.filter(type => type !== value) 
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contentTypes.length === 0) {
      toast.error("Please select at least one content type");
      return;
    }
    
    if (!description) {
      toast.error("Please describe your content style");
      return;
    }

    if (!targetAudience) {
      toast.error("Please specify your target audience");
      return;
    }

    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      const preferences: ContentPreference = {
        contentTypes,
        description,
        postFrequency,
        targetAudience,
      };
      
      toast.success("Preferences saved!");
      setIsLoading(false);
      onPreferenceSubmit(preferences);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Content Preferences</CardTitle>
        <CardDescription>
          Tell us about the content you want to create for your Instagram
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">What type of content do you want to post?</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {contentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
                  <Checkbox
                    id={option.id}
                    checked={contentTypes.includes(option.id)}
                    onCheckedChange={() => handleContentTypeChange(option.id)}
                  />
                  <label htmlFor={option.id} className="text-sm cursor-pointer">{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-lg font-medium">
              Describe your content style and what you want to achieve
            </label>
            <Textarea
              id="description"
              placeholder="I want to showcase my minimalist lifestyle with a focus on sustainable products..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium">How often do you want to post?</label>
            <div className="flex flex-wrap gap-2">
              {["daily", "3x weekly", "weekly"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={postFrequency === option ? "default" : "outline"}
                  onClick={() => setPostFrequency(option)}
                  className="rounded-full"
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="audience" className="text-lg font-medium">
              Who is your target audience?
            </label>
            <Textarea
              id="audience"
              placeholder="Young professionals interested in sustainable living..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Generate Content Calendar"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentPreferences;
