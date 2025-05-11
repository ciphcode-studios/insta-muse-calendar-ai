
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, FileText, CalendarPlus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const CalendarManager = () => {
  const { user } = useAuth();
  const [hasCalendar, setHasCalendar] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkCalendarExists = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('content_preferences')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking calendar:', error);
          toast.error('Failed to check if you have an existing calendar');
          setHasCalendar(false);
        } else {
          setHasCalendar(!!data);
        }
      } catch (error) {
        console.error('Error checking calendar:', error);
        setHasCalendar(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCalendarExists();
  }, [user]);
  
  const handleCreateCalendar = () => {
    navigate('/');
  };
  
  const handleExportCalendar = () => {
    // This would generate a downloadable calendar file in a real app
    toast.success('Calendar exported successfully!');
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
  
  if (!hasCalendar) {
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
        
        <Button variant="outline" onClick={handleExportCalendar} className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export Calendar
        </Button>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-medium">Your Content Calendar</h2>
        </div>
        {/* Calendar content would be displayed here */}
        <p className="text-muted-foreground text-sm">Your calendar content will appear here.</p>
      </div>
    </div>
  );
};

export default CalendarManager;
