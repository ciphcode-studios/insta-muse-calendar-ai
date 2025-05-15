
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Search, Download, Eye, CalendarPlus, Trash2, ArrowLeft } from 'lucide-react'; // Added Trash2
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ContentCalendar, { PostSuggestion } from './ContentCalendar';

interface SavedCalendar {
  id: string;
  name: string;
  created_at: string;
  posts: PostSuggestion[];
  user_id: string;
  updated_at: string;
}

// Helper function to generate a random gradient
const getRandomGradient = () => {
  const gradients = [
    'from-pink-500 to-purple-500',
    'from-blue-500 to-green-500',
    'from-yellow-500 to-red-500',
    'from-teal-500 to-cyan-500',
    'from-indigo-500 to-pink-500',
    'from-orange-500 to-amber-500',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const CalendarManager = () => {
  const { user } = useAuth();
  const [savedCalendars, setSavedCalendars] = useState<SavedCalendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendar, setSelectedCalendar] = useState<SavedCalendar | null>(null);
  const [filteredCalendars, setFilteredCalendars] = useState<SavedCalendar[]>([]);
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
          const calendars: SavedCalendar[] = data.map(calendar => ({
            ...calendar,
            posts: calendar.posts as unknown as PostSuggestion[]
          }));
          setSavedCalendars(calendars);
          setFilteredCalendars(calendars); // Initialize filtered calendars
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

  useEffect(() => {
    // Filter calendars based on search query
    if (!searchQuery.trim()) {
      setFilteredCalendars(savedCalendars);
      return;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = savedCalendars.filter(calendar =>
      calendar.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCalendars(filtered);
  }, [searchQuery, savedCalendars]);

  const handleCreateCalendar = () => {
    navigate('/');
  };

  const handleExportCalendar = (calendar: SavedCalendar) => {
    toast.success(`Calendar "${calendar.name}" exported successfully!`);
  };

  const handleViewCalendar = (calendar: SavedCalendar) => {
    setSelectedCalendar(calendar);
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete calendars");
      return;
    }

    // Optimistic UI update
    const originalCalendars = [...savedCalendars];
    setSavedCalendars(prev => prev.filter(c => c.id !== calendarId));
    setFilteredCalendars(prev => prev.filter(c => c.id !== calendarId));

    try {
      const { error } = await supabase
        .from('content_calendars')
        .delete()
        .eq('id', calendarId)
        .eq('user_id', user.id); // Ensure user can only delete their own calendars

      if (error) {
        throw error;
      }
      toast.success("Calendar deleted successfully!");
    } catch (error) {
      console.error("Error deleting calendar:", error);
      toast.error("Failed to delete calendar. Please try again.");
      // Revert UI update on error
      setSavedCalendars(originalCalendars);
      setFilteredCalendars(originalCalendars.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  };

  const handleBackToList = () => {
    setSelectedCalendar(null);
  };

  // Removed handleSearch function as filtering is now done via useEffect

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedCalendar) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendars
          </Button>
          <h2 className="text-xl font-semibold text-center flex-1 truncate px-4">{selectedCalendar.name}</h2>
          <Button variant="outline" onClick={() => handleExportCalendar(selectedCalendar)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        <ContentCalendar posts={selectedCalendar.posts} onBack={handleBackToList} calendarName={selectedCalendar.name} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Your Created Calendars</h1>
        <div className="flex w-full md:w-auto items-center space-x-2 md:ml-auto">
          <Input
            type="search"
            placeholder="Search your calendars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:max-w-xs"
          />
          <Button 
            variant="default" 
            onClick={handleCreateCalendar} 
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 whitespace-nowrap"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </div>
      </div>

      {savedCalendars.length === 0 && !isLoading && (
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
      )}

      {filteredCalendars.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalendars.map((calendar) => (
            <Card key={calendar.id} className="overflow-hidden flex flex-col">
              <CardHeader className={`bg-gradient-to-br ${getRandomGradient()} text-white p-4`}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{calendar.name}</CardTitle>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                    {calendar.posts.length} posts
                  </span>
                </div>
                <p className="text-xs opacity-80 mt-1">Created on {new Date(calendar.created_at).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                {/* You can add a brief description or preview here if needed */}
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(calendar.updated_at || calendar.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="p-4 border-t flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleViewCalendar(calendar)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExportCalendar(calendar)}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Export
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteCalendar(calendar.id)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {filteredCalendars.length === 0 && searchQuery.trim() !== '' && (
        <div className="text-center py-10">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No calendars found</h3>
            <p className="mt-1 text-sm text-gray-500">Your search for "{searchQuery}" did not match any calendars.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
