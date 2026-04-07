'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyListingsPage() {
  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div style={{ padding: '100px 32px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        <h1>My Listings</h1>
        <p style={{ marginTop: '16px', color: '#555' }}>View and manage your property listings here.</p>
      </div>
    </ProtectedRoute>
  );
}
