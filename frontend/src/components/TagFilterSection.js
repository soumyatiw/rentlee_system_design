'use client';

import { useEffect, useState } from 'react';
import styles from './TagFilterSection.module.css';
import propertiesData from '@/data/main_data.json';
import { Flame, Building2, Home, Hotel, Castle } from 'lucide-react';
import { BedDouble, Bath, Ruler, Sofa, CalendarDays, MapPin, XCircle } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';

export default function TagFilterSection() {
  const TAGS = [
    { label: 'Popular', icon: <Flame size={16} />, value: 'Popular' },
    { label: 'Apartments', icon: <Building2 size={16} />, value: 'Apartment' },
    { label: 'Houses', icon: <Home size={16} />, value: 'House' },
    { label: 'PG', icon: <Hotel size={16} />, value: 'PG' },
    { label: 'Villa', icon: <Castle size={16} />, value: 'Villa' },
  ];

  const [selectedTag, setSelectedTag] = useState('Popular');
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  useEffect(() => {
    let filtered;

    if (selectedTag === 'Popular') {
      filtered = [...propertiesData]
        .sort((a, b) => a.rent - b.rent)
        .slice(0, 8);
    } else {
      filtered = propertiesData
        .filter((p) => p.category?.toLowerCase() === selectedTag.toLowerCase())
        .slice(0, 8);
    }

    setFilteredProperties(filtered);
  }, [selectedTag]);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  return (
    <section className={styles.section}>
      <div className={styles.tags}>
        {TAGS.map((tag) => (
          <button
            key={tag.value}
            className={`${styles.tagButton} ${selectedTag === tag.value ? styles.active : ''}`}
            onClick={() => setSelectedTag(tag.value)}
          >
            {tag.icon}
            {tag.label}
          </button>
        ))}
      </div>

      <h2 className={styles.heading}>Browse Rental Properties</h2>

      <div className={styles.cardsGrid}>
        {filteredProperties.map((property, idx) => (
          <div key={idx} className={styles.card}>
            <img src={property.image_url} alt={property.title} className={styles.image} />

            <div className={styles.content}>
              <h3 className={styles.title}>{property.title}</h3>
              <p className={styles.price}>₹{property.rent.toLocaleString()}/mo</p>
              <p className={styles.address}>
                <MapPin size={14} /> {property.city}, {property.state}
              </p>
              <div className={styles.details}>
                <span><BedDouble size={14} /> {property.bedrooms} Beds</span>
                <span><Bath size={14} /> {property.bathrooms} Baths</span>
                <span><Ruler size={14} /> {property.area_sqft} sq.ft</span>
              </div>
              <div className={styles.extra}>
                <span><Sofa size={14} /> {property.furnishing}</span>
                <span>
                  <CalendarDays size={14} /> Available: {new Date(property.available_from).toLocaleDateString()}
                </span>
              </div>
              <button className={styles.viewButton} onClick={() => handleViewDetails(property)}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={closeModal}><XCircle size={20} /></button>
            {selectedProperty && isLoggedIn ? (
              <>
                <h2 className={styles.modalTitle}>{selectedProperty.title}</h2>
                <img src={selectedProperty.image_url} alt={selectedProperty.title} className={styles.modalImage} />
                <p className={styles.modalText}><MapPin size={14} /> {selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state}</p>
                <p className={styles.modalText}>₹{selectedProperty.rent.toLocaleString()}/month</p>
                <p className={styles.modalText}>
                  <BedDouble size={14} /> {selectedProperty.bedrooms} Beds | <Bath size={14} /> {selectedProperty.bathrooms} Baths | <Ruler size={14} /> {selectedProperty.area_sqft} sqft
                </p>
                <p className={styles.modalText}><Sofa size={14} /> <strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
                <p className={styles.modalText}><CalendarDays size={14} /> <strong>Available From:</strong> {selectedProperty.available_from}</p>
                <p className={styles.modalText}><strong>Contact:</strong> {selectedProperty.contact}</p>
              </>
            ) : (
              <div className={styles.loginPrompt}>
                <h2>Please login to view property details</h2>
                <p>You need to login or signup to see full details.</p>
                <Link href="/login" className={styles.loginBtn}>Login / Signup</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}