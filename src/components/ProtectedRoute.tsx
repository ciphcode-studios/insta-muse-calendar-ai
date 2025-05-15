
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  // Only show loading state when we're actually loading
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If not loading and no user, redirect to auth
  if (!isLoading && !user) {
    console.log("No authenticated user, redirecting to login");
    return <Navigate to="/auth" replace />;
  }
  
  // If not loading and there is a user, render children
  return <>{children}</>;
};

export default ProtectedRoute;
