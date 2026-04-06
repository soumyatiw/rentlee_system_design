'use client';

import { useEffect, useState } from 'react';
import { fetchProperties, adminDeleteListing } from '@/lib/api';
import styles from '../Admin.module.css';

export default function AllListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadData = async () => {
    try {
      // Re-using the standard listing fetcher, unbounded internally
      const res = await fetchProperties({ limit: 100 });
      if (res.success) setListings(res.data.data); // data.data matches pagination object
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleForceDelete = async () => {
    try {
      await adminDeleteListing(deleteId);
      setDeleteModalOpen(false);
      loadData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>System Listings Directory</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title / Category</th>
              <th>Lister</th>
              <th>Location</th>
              <th>Price</th>
              <th>Date Listed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : listings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No active listings.</td></tr>
            ) : (
              listings.map(listing => (
                <tr key={listing._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{listing.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{listing.category}</div>
                  </td>
                  <td>{listing.owner?.username || 'Unknown'}</td>
                  <td>{listing.city}, {listing.locality}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>${listing.rent}/mo</td>
                  <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => confirmDelete(listing._id)}>Force Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle} style={{ color: '#b91c1c' }}>Confirm Deletion</h3>
            <p style={{ marginBottom: '20px', color: '#475569', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete this listing? This action cannot be reversed.
            </p>
            <div className={styles.modalActions}>
              <button className={`${styles.actionBtn} ${styles.neutralBtn}`} onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={handleForceDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
