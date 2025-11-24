'use client';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'donor';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userData) {
      router.push('/auth/login');
      return;
    }

    if (!loading && userData && requiredRole && userData.role !== requiredRole) {
      router.push('/');
      return;
    }
  }, [userData, loading, router, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!userData || (requiredRole && userData.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}