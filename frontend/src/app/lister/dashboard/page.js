'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ListerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h1>Lister Dashboard</h1>
        <p>Manage your properties, handle inquiries, and review analytics.</p>
      </div>
    </ProtectedRoute>
  );
}
