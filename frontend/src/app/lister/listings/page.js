'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { getMyListings, deleteProperty } from '@/lib/api';
import ListingCard from '../../../components/ListingCard';
import AddListingModal from '../../../components/AddListingModal';
import btnStyles from '../../../components/common/Button.module.css';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMyListings()
      .then(res => {
        if (mounted && res && res.success) setListings(res.data || []);
      })
      .catch(err => setError(err.message || 'Failed to fetch'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await deleteProperty(id);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div style={{ padding: '64px 40px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <h1>My Listings</h1>
        <p style={{ marginTop: '12px', color: '#555' }}>View and manage your property listings here.</p>
        <div style={{ marginTop: 12 }}>
          <button className={btnStyles.primary} onClick={() => setModalOpen(true)}>Add Property</button>
        </div>

        {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
          listings.length === 0 ? <div style={{ color: '#666', marginTop: 24 }}>No listings found.</div> : (
            <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
              {listings.map(l => (
                <div key={l._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListingCard listing={l} />
                  <div style={{ marginLeft: 12 }}>
                    <button style={{ marginRight: 8 }} onClick={() => alert('Edit flow not implemented')}>Edit</button>
                    <button onClick={() => handleDelete(l._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <AddListingModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={(newItem) => setListings(prev => [newItem, ...prev])} />
    </ProtectedRoute>
  );
}
