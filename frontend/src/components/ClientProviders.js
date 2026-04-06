'use client';

import { AuthProvider } from '@/context/AuthContext';

/**
 * Thin client-side wrapper so AuthProvider (and Firebase) are
 * never executed during Next.js server-side rendering.
 */
export default function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
