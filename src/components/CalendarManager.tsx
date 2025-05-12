
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, Download, FileText, CalendarPlus, Eye, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ContentCalendar, { PostSuggestion } from './ContentCalendar';

interface SavedCalendar {
  id: string;
  name: string;
  created_at: string;
  posts: PostSuggestion[];
}

export const CalendarManager = () => {
  const { user } = useAuth();
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState<SavedCalendar | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCalendars = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('content_calendars')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setSavedCalendars(data as SavedCalendar[]);
        }
      } catch (error) {
        console.error('Error fetching calendars:', error);
        toast.error('Failed to load your calendars');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCalendars();
  }, [user]);
  
  const handleCreateCalendar = () => {
    navigate('/');
  };
  
  const handleExportCalendar = (calendar: SavedCalendar) => {
    // This would generate a downloadable calendar file in a real app
    toast.success(`Calendar "${calendar.name}" exported successfully!`);
  };
  
  const handleViewCalendar = (calendar: SavedCalendar) => {
    setSelectedCalendar(calendar);
  };
  
  const handleBackToList = () => {
    setSelectedCalendar(null);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    toast.success(`Searching for "${searchQuery}"`);
    // In a real app, this would filter the content based on the search query
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (selectedCalendar) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendars
          </Button>
          <h2 className="text-xl font-semibold">{selectedCalendar.name}</h2>
          <Button variant="outline" onClick={() => handleExportCalendar(selectedCalendar)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <ContentCalendar posts={selectedCalendar.posts} onBack={handleBackToList} />
      </div>
    );
  }
  
  if (savedCalendars.length === 0) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-center">Create Your First Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <CalendarPlus className="h-16 w-16 text-purple-500" />
          <p className="text-center text-muted-foreground">
            You don't have any content calendars yet. Let's create your first Instagram content calendar!
          </p>
          <Button 
            onClick={handleCreateCalendar}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
          >
            Create Calendar
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search your content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
        
        <Button 
          variant="default" 
          onClick={handleCreateCalendar} 
          className="ml-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create New Calendar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedCalendars.map((calendar) => (
          <Card key={calendar.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-lg">{calendar.name}</CardTitle>
              <p className="text-xs opacity-90">Created on {new Date(calendar.created_at).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-muted-foreground text-sm">
                {calendar.posts.length} posts
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleViewCalendar(calendar)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportCalendar(calendar)}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarManager;
