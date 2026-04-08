'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';

export default function MyBlogsPage() {
  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div style={{ padding: '100px 32px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        <h1>My Blogs</h1>
        <p style={{ marginTop: '16px', color: '#555' }}>Manage your written blogs here.</p>
      </div>
    </ProtectedRoute>
  );
}
