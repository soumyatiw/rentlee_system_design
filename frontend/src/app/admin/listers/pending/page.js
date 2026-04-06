'use client';

import { useEffect, useState } from 'react';
import { fetchPendingListers, approveLister, rejectLister } from '@/lib/api';
import styles from '../../Admin.module.css';

export default function PendingListersPage() {
  const [listers, setListers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    try {
      const res = await fetchPendingListers(1, 100);
      if (res.success) setListers(res.data.listers);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveLister(id);
      loadData();
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

  if (loading) return <div>Loading requests...</div>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Pending Lister Approvals</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name / Company</th>
              <th>Email & Phone</th>
              <th>Description</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No pending applications.</td></tr>
            ) : (
              listers.map(lister => (
                <tr key={lister._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{lister.username}</div>
                    {/* Display Firebase metadata or schema structure mapping as needed */}
                  </td>
                  <td>
                    <div>{lister.email}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Pending review metadata...
                    </div>
                  </td>
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
              placeholder="Reason for rejection (Optional - sent via email)"
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
