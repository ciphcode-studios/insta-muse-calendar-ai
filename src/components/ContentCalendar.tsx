
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Image, ArrowLeft, ArrowRight, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<PostSuggestion[]>(posts);
  
  const weeksCount = Math.ceil(filteredPosts.length / 7);
  
  const currentPosts = filteredPosts.slice(currentWeek * 7, (currentWeek + 1) * 7);

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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post => 
      post.caption.toLowerCase().includes(query) || 
      post.imagePrompt.toLowerCase().includes(query)
    );
    
    setFilteredPosts(filtered);
    setCurrentWeek(0);
    
    if (filtered.length === 0) {
      toast.info("No posts match your search");
    } else {
      toast.success(`Found ${filtered.length} matching posts`);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPosts(posts);
    setCurrentWeek(0);
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
          <Button onClick={exportCalendar}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex items-center space-x-2 max-w-md mx-auto">
        <Input
          type="search"
          placeholder="Search captions and image prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        {searchQuery && (
          <Button type="button" variant="ghost" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>

      {filteredPosts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No posts matching your search criteria</p>
        </Card>
      ) : (
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
      )}

      <div className="flex justify-center items-center space-x-4 pt-4">
        <Button 
          variant="outline" 
          onClick={prevWeek}
          disabled={currentWeek === 0 || filteredPosts.length === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2">Previous Week</span>
        </Button>
        <div className="text-sm font-medium">
          {filteredPosts.length > 0 ? `Week ${currentWeek + 1} of ${weeksCount}` : 'No results'}
        </div>
        <Button 
          variant="outline" 
          onClick={nextWeek}
          disabled={currentWeek >= weeksCount - 1 || filteredPosts.length === 0}
        >
          <span className="mr-2">Next Week</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentCalendar;
