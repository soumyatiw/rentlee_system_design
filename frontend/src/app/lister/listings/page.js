'use client';

import { useState, useEffect } from 'react';
import { getMyListings, deleteProperty } from '@/lib/api';
import styles from './MyListings.module.css';
import { Plus, Edit2, Trash2, Eye, MapPin, IndianRupee, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const res = await getMyListings();
      if (res.success) setListings(res.data);
    } catch (err) {
      console.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing? It will be marked as inactive.')) return;
    
    try {
      const res = await deleteProperty(id);
      if (res.success) {
        setListings(listings.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  if (loading) return <div className={styles.loading}>Loading your properties...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Listings</h1>
          <p>You have <span>{listings.length}</span> properties listed.</p>
        </div>
        <Link href="/lister/listings/create" className={styles.createBtn}>
          <Plus size={18} /> Add New Listing
        </Link>
      </header>

      {listings.length > 0 ? (
        <div className={styles.grid}>
          {listings.map(listing => (
            <div key={listing._id} className={styles.card}>
              <div className={styles.imageSection}>
                <img src={listing.image_url} alt={listing.title} />
                <div className={styles.badge}>{listing.category}</div>
                <div className={`${styles.status} ${styles[listing.status?.toLowerCase()] || styles.available}`}>
                  {listing.status || 'Available'}
                </div>
              </div>

              <div className={styles.infoSection}>
                <h3 className={styles.title}>{listing.title}</h3>
                <p className={styles.location}><MapPin size={14} /> {listing.city}, {listing.state}</p>
                
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <p>Rent</p>
                    <h4>₹{listing.rent.toLocaleString()}</h4>
                  </div>
                  <div className={styles.statItem}>
                    <p>Views</p>
                    <h4>{listing.views || 0}</h4>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href={`/browse/${listing._id}`} className={styles.actionBtn} title="View Live">
                    <Eye size={18} />
                  </Link>
                  <Link href={`/lister/listings/edit/${listing._id}`} className={styles.actionBtn} title="Edit">
                    <Edit2 size={18} />
                  </Link>
                  <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(listing._id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}><Plus size={48} /></div>
          <h3>No properties listed yet</h3>
          <p>Start your journey by adding your first rental property.</p>
          <Link href="/lister/listings/create" className={styles.emptyBtn}>Add My First Listing</Link>
        </div>
      )}
    </div>
  );
}
