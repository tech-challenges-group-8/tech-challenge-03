import { AuthScreen } from '@/components/auth/AuthScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};
