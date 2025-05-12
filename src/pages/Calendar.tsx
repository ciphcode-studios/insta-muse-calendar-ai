
import React from 'react';
import UserProfile from '@/components/UserProfile';
import CalendarManager from '@/components/CalendarManager';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-2">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Insta Content Planner
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Create New Calendar</span>
            </Button>
          </Link>
          <UserProfile />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CalendarManager />
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

export default Calendar;
