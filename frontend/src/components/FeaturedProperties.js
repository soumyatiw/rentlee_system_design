'use client';

import { useState } from 'react';
import styles from './FeaturedProperties.module.css';
import Link from 'next/link';
import properties from '@/data/main_data.json';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { useAuthContext } from '@/context/AuthContext';

const FeaturedProperties = () => {
  const featured = properties.slice(0, 3);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setShowModal(false);
  };

  return (
    <section className={styles.featured}>
      <h2 className={styles.heading}>Featured Properties</h2>
      <p className={styles.subheading}>Discover our handpicked rentals available right now</p>

      <div className={styles.grid} data-aos="fade-up" data-aos-duration="2000">
        {featured.map((property) => (
          <div className={styles.card} key={property.id}>
            <img src={property.image_url} alt={property.title} className={styles.image} />
            <div className={styles.details}>
              <h3>{property.title}</h3>
              <p className={styles.meta}><FaMapMarkerAlt className={styles.icon} /> {property.city}, {property.state}</p>
              <div className={styles.specs}>
                <div className={styles.specItem}><FaBed className={styles.icon} /> <span>{property.bedrooms} Beds</span></div>
                <div className={styles.specItem}><FaBath className={styles.icon} /> <span>{property.bathrooms} Baths</span></div>
                <div className={styles.specItem}><FaRulerCombined className={styles.icon} /> <span>{property.area_sqft} sqft</span></div>
              </div>
              <div className={styles.bottom}>
                <span className={styles.price}>₹{property.rent.toLocaleString()}/mo</span>
                <button type="button" onClick={() => handleViewDetails(property)} className={styles.viewBtn}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link href="/browse" className={styles.browseAllBtn} data-aos="fade-up" data-aos-duration="2000">
        Browse All Properties
      </Link>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={closeModal}>×</button>
            {selectedProperty ? (
              isLoggedIn ? (
                <div className={styles.modalContent}>
                  <h2 className={styles.modalTitle}>{selectedProperty.title}</h2>
                  <img src={selectedProperty.image_url} alt={selectedProperty.title} className={styles.modalImage} />
                  <p className={styles.modalText}><FaMapMarkerAlt className={styles.icon} /> {selectedProperty.locality}, {selectedProperty.city}, {selectedProperty.state}</p>
                  <p className={styles.modalText}><strong>₹{selectedProperty.rent.toLocaleString()}</strong>/month</p>
                  <p className={styles.modalText}>
                    <FaBed className={styles.icon} /> {selectedProperty.bedrooms} Beds &nbsp;
                    <FaBath className={styles.icon} /> {selectedProperty.bathrooms} Baths &nbsp;
                    <FaRulerCombined className={styles.icon} /> {selectedProperty.area_sqft} sqft
                  </p>
                  <p className={styles.modalText}><strong>Furnishing:</strong> {selectedProperty.furnishing}</p>
                  <p className={styles.modalText}><strong>Available From:</strong> {selectedProperty.available_from}</p>
                  <p className={styles.modalText}><strong>Contact:</strong> {selectedProperty.contact}</p>
                </div>
              ) : (
                <>
                  <h2>Please login to view property details</h2>
                  <p>To access full information and contact the owner, please login or sign up.</p>
                  <Link href="/login" className={styles.loginBtn}>Login / Signup</Link>
                </>
              )
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedProperties;