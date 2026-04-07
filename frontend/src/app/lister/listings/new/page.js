'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddListingPage() {
  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div style={{ padding: '100px 32px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        <h1>Add New Property</h1>
        <p style={{ marginTop: '16px', color: '#555' }}>Form to add a new property listing will go here.</p>
      </div>
    </ProtectedRoute>
  );
}
