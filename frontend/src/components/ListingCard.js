'use client';

import React from 'react';
import styles from './ListingCard.module.css';
import { MapPin, BedDouble, Bath, Ruler, Heart, MessageCircle } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import useSavedProperties from '@/hooks/useSavedProperties';
import Link from 'next/link';

export default function ListingCard({ property }) {
  const { user } = useAuthContext();
  const { toggleSave, isSaved } = useSavedProperties();
  const isLoggedIn = !!user;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleSave(property._id);
  };

  return (
    <div className={styles.card}>
      <Link href={`/browse/${property._id}`} className={styles.linkWrapper}>
        <div className={styles.imageContainer}>
          <img src={property.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'} alt={property.title} className={styles.image} />
          {isLoggedIn && user?.role === 'user' && (
            <button className={styles.saveBtn} onClick={handleToggleSave}>
              <Heart fill={isSaved(property._id) ? '#ff4444' : 'none'} color={isSaved(property._id) ? '#ff4444' : 'white'} size={20} />
            </button>
          )}
          <div className={styles.badge}>{property.category}</div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{property.title}</h3>
            <p className={styles.price}>₹{property.rent.toLocaleString()}<span>/mo</span></p>
          </div>

          <p className={styles.location}>
            <MapPin size={14} /> {property.locality}, {property.city}
          </p>

          <div className={styles.specs}>
            <div className={styles.specItem}>
              <BedDouble size={16} />
              <span>{property.bedrooms}</span>
            </div>
            <div className={styles.specItem}>
              <Bath size={16} />
              <span>{property.bathrooms}</span>
            </div>
            <div className={styles.specItem}>
              <Ruler size={16} />
              <span>{property.area_sqft} sqft</span>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.status}>{property.status || 'Available'}</span>
            <div className={styles.actions}>
               <button className={styles.enquireBtn}>
                 <MessageCircle size={16} /> 
               </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
