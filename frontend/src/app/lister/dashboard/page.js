'use client';

import { useState, useEffect } from 'react';
import { getListerStats, getMyListings } from '@/lib/api';
import styles from './Dashboard.module.css';
import { Building2, Eye, MessageSquare, Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ListerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, listingsRes] = await Promise.all([
          getListerStats(),
          getMyListings()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (listingsRes.success) setRecentListings(listingsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load lister dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className={styles.loading}>Updating your dashboard...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Welcome back, Lister!</h1>
          <p>Here's what's happening with your properties today.</p>
        </div>
        <Link href="/lister/listings/create" className={styles.createBtn}>
          <Plus size={18} /> List New Property
        </Link>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <Building2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Listings</p>
            <h3>{stats?.totalListings || 0}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.green}`}>
             <ArrowUpRight size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Active Listings</p>
            <h3>{stats?.activeListings || 0}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
             <Eye size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>Total Views</p>
            <h3>{stats?.totalViews || 0}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
             <MessageSquare size={24} />
          </div>
          <div className={styles.statInfo}>
            <p>New Enquiries</p>
            <h3>0</h3> {/* To be dynamic soon */}
          </div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Listings</h2>
          <Link href="/lister/listings">View All</Link>
        </div>

        <div className={styles.recentGrid}>
          {recentListings.length > 0 ? recentListings.map(listing => (
            <div key={listing._id} className={styles.miniCard}>
              <img src={listing.image_url} alt={listing.title} />
              <div className={styles.miniContent}>
                <h4>{listing.title}</h4>
                <p>₹{listing.rent.toLocaleString()}/mo</p>
                <span className={styles.statusBadge}>{listing.status}</span>
              </div>
            </div>
          )) : (
            <p className={styles.empty}>You haven't listed any properties yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
