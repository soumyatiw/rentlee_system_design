'use client';

import { useEffect, useState } from 'react';
import { fetchAllListers, suspendLister, approveLister } from '@/lib/api';
import styles from '../Admin.module.css';

export default function AllListersPage() {
  const [listers, setListers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Approved', 'Pending', 'Rejected', 'Suspended'];

  const loadData = async () => {
    try {
      const res = await fetchAllListers(activeTab, 1, 100);
      if (res.success) setListers(res.data.listers);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const handleAction = async (action, id) => {
    try {
      if (action === 'suspend') await suspendLister(id);
      if (action === 'approve') await approveLister(id); // Re-approve
      loadData();
    } catch (err) { alert(err.message); }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className={`${styles.statusBadge} ${styles['status-approved']}`}>Approved</span>;
      case 'pending': return <span className={`${styles.statusBadge} ${styles['status-pending']}`}>Pending</span>;
      case 'rejected': return <span className={`${styles.statusBadge} ${styles['status-rejected']}`}>Rejected</span>;
      case 'suspended': return <span className={`${styles.statusBadge} ${styles['status-suspended']}`}>Suspended</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Lister Directory</h1>

      <div className={styles.tableContainer}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : listers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No listers found.</td></tr>
            ) : (
              listers.map(lister => (
                <tr key={lister._id}>
                  <td style={{ fontWeight: 500 }}>{lister.username}</td>
                  <td>{lister.email}</td>
                  <td>{getStatusBadge(lister.listerStatus)}</td>
                  <td>{new Date(lister.createdAt).toLocaleDateString()}</td>
                  <td>
                    {lister.listerStatus === 'approved' && (
                      <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleAction('suspend', lister._id)}>Suspend</button>
                    )}
                    {lister.listerStatus === 'suspended' && (
                      <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleAction('approve', lister._id)}>Re-Approve</button>
                    )}
                    {/* Additional bounds logic handles 'pending' inside the Pending UI primarily */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
