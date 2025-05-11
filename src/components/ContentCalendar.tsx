
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Image, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export interface PostSuggestion {
  day: string;
  date: string;
  time: string;
  imagePrompt: string;
  caption: string;
}

interface ContentCalendarProps {
  posts: PostSuggestion[];
  onBack: () => void;
}

const ContentCalendar = ({ posts, onBack }: ContentCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const weeksCount = Math.ceil(posts.length / 7);
  
  const currentPosts = posts.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const nextWeek = () => {
    if (currentWeek < weeksCount - 1) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const prevWeek = () => {
    if (currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const saveToCalendar = () => {
    // This would integrate with calendar API in a real app
    toast.success("Calendar saved to your account!");
  };

  const exportCalendar = () => {
    // This would generate a downloadable calendar file in a real app
    toast.success("Calendar exported successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Preferences
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Your Content Calendar</h2>
          <p className="text-muted-foreground">Week {currentWeek + 1} of {weeksCount}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={saveToCalendar} variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button onClick={exportCalendar}>Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-32 flex items-center justify-center">
              <Image className="h-16 w-16 text-white" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{post.day}</p>
                  <CardTitle className="text-lg">{post.date}</CardTitle>
                </div>
                <p className="text-sm font-medium bg-secondary px-2 py-1 rounded-md">
                  {post.time}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Image Prompt</h4>
                <p className="text-sm border-l-2 border-purple-500 pl-3 py-1">{post.imagePrompt}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Caption</h4>
                <p className="text-sm">{post.caption}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 pt-4">
        <Button 
          variant="outline" 
          onClick={prevWeek}
          disabled={currentWeek === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2">Previous Week</span>
        </Button>
        <div className="text-sm font-medium">
          Week {currentWeek + 1} of {weeksCount}
        </div>
        <Button 
          variant="outline" 
          onClick={nextWeek}
          disabled={currentWeek >= weeksCount - 1}
        >
          <span className="mr-2">Next Week</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentCalendar;
