'use client';

import { useEffect, useState } from 'react';
import { fetchAllUsers } from '@/lib/api';
import styles from '../Admin.module.css';

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetchAllUsers(1, 100);
      if (res.success) setUsers(res.data.users);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div>
      <h1 className={styles.pageTitle}>User Accounts</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Saved Properties</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500 }}>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles['status-suspended']}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      {user.savedProperties?.length || 0}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
