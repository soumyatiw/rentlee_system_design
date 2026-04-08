'use client';

import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { getSavedProperties } from '@/lib/api';
import useSavedProperties from '@/hooks/useSavedProperties';
import { useRouter } from 'next/navigation';
import { MapPin, IndianRupee, BedDouble, Bath, Ruler, Heart, Trash2 , XCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import styles from './Saved.module.css';

export default function SavedPropertiesPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { toggleSave, isSaved } = useSavedProperties();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'user')) {
      router.replace('/login');
      return;
    }

    if (user && user.role === 'user') {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const res = await getSavedProperties();
      if (res.success && res.data) {
        setProperties(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch saved properties', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e, propertyId) => {
    e.stopPropagation();
    await toggleSave(propertyId);
    setProperties(prev => prev.filter(p => p._id !== propertyId));
    if (selectedProperty?._id === propertyId) {
      setShowModal(false);
    }
  };

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  if (authLoading || loading) {
    return <div className={styles.loading}>Loading your saved properties...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>My Saved Properties</h1>
        {properties.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't saved any properties yet.</p>
            <button className={styles.browseBtn} onClick={() => router.push('/browse')}>Browse Properties</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {properties.map(property => (
              <div key={property._id} className={styles.card} onClick={() => handleCardClick(property)}>
                <div className={styles.imageContainer}>
                  <img src={property.image_url} alt={property.title} className={styles.image} />
                </div>
                <div className={styles.details}>
                  <h3 className={styles.cardTitle}>{property.title}</h3>
                  <p className={styles.price}><IndianRupee size={14}/> {property.rent.toLocaleString()}/mo</p>
                  <p className={styles.location}><MapPin size={14}/> {property.locality}, {property.city}</p>
                  <div className={styles.specs}>
                    <span><BedDouble size={14}/> {property.bedrooms} Beds</span>
                    <span><Bath size={14}/> {property.bathrooms} Baths</span>
                    <span><Ruler size={14}/> {property.area_sqft} sqft</span>
                  </div>
                  <button 
                    className={styles.removeBtn} 
                    onClick={(e) => handleToggle(e, property._id)}
                  >
                    <Trash2 size={16} />
                    <span>Remove from Saved</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedProperty && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><XCircle size={24} /></button>
              <h2 className={styles.modalTitle}>{selectedProperty.title}</h2>
              <img src={selectedProperty.image_url} alt={selectedProperty.title} className={styles.modalImage} />
              
              <div className={styles.modalDetailsList}>
                <div className={styles.modalDetailItem}>
                  <strong>Location:</strong>
                  <span>{selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Monthly Rent:</strong>
                  <span className={styles.modalPrice}>₹{selectedProperty.rent.toLocaleString()}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Property Stats:</strong>
                  <span>{selectedProperty.bedrooms} Bedrooms • {selectedProperty.bathrooms} Bathrooms • {selectedProperty.area_sqft} sqft</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Furnishing:</strong>
                  <span>{selectedProperty.furnishing}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Property Type:</strong>
                  <span>{selectedProperty.category}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Available From:</strong>
                  <span>{selectedProperty.available_from}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Owner Details:</strong>
                  <span>{selectedProperty.owner?.username || 'Verified Owner'}</span>
                </div>
                <div className={styles.modalDetailItem}>
                  <strong>Contact:</strong>
                  <span>{selectedProperty.contact}</span>
                </div>
              </div>

              <button 
                className={styles.modalRemoveBtn} 
                onClick={(e) => handleToggle(e, selectedProperty._id)}
              >
                <Trash2 size={18} />
                <span>Unsave Property</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
