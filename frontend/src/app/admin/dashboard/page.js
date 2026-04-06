'use client';

import { useEffect, useState } from 'react';
import { fetchAdminStats, fetchPendingListers, approveLister, rejectLister } from '@/lib/api';
import styles from '../Admin.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, listers: 0, pending: 0, listings: 0 });
  const [recentPending, setRecentPending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    try {
      const statsRes = await fetchAdminStats();
      if (statsRes.success) setStats(statsRes.data);

      const pendingRes = await fetchPendingListers(1, 5); // top 5
      if (pendingRes.success) setRecentPending(pendingRes.data.listers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveLister(id);
      loadData(); // Re-sync table and counts securely
    } catch (err) { alert(err.message); }
  };

  const openRejectModal = (id) => {
    setRejectId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    try {
      await rejectLister(rejectId, rejectReason);
      setRejectModalOpen(false);
      loadData();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Users</div>
          <div className={styles.statValue}>{stats.users}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Approved Listers</div>
          <div className={styles.statValue}>{stats.listers}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Pending Requests</div>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{stats.pending}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Listings</div>
          <div className={styles.statValue}>{stats.listings}</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Recent Pending Approvals</h3>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentPending.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No pending applications.</td></tr>
            ) : (
              recentPending.map(lister => (
                <tr key={lister._id}>
                  <td style={{ fontWeight: 500 }}>{lister.username}</td>
                  <td>{lister.email}</td>
                  <td>{new Date(lister.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleApprove(lister._id)}>Approve</button>
                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => openRejectModal(lister._id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rejectModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Reject Application</h3>
            <textarea 
              className={styles.modalTextarea} 
              placeholder="Reason for rejection (Optional)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={`${styles.actionBtn} ${styles.neutralBtn}`} onClick={() => setRejectModalOpen(false)}>Cancel</button>
              <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={handleReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
