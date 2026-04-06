'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Just redirect them to their respective home/dashboard if they try matching bad bounds
        if (user.role === 'admin') router.replace('/admin/dashboard');
        else if (user.role === 'lister') router.replace('/lister/dashboard');
        else router.replace('/');
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return <div>Loading access...</div>;

  // Render children only if user is loaded and roles match
  if (!user) return null;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return null;

  return children;
}
