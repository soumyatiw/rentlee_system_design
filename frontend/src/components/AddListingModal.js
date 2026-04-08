'use client';

import { useState } from 'react';
import styles from '@/app/lister/listings/NewListing.module.css';
import { createProperty } from '@/lib/api';

export default function AddListingModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [rent, setRent] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [description, setDescription] = useState('');
  const [stateField, setStateField] = useState('');
  const [category, setCategory] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [areaSqft, setAreaSqft] = useState(500);
  const [furnishing, setFurnishing] = useState('Unfurnished');
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().slice(0,10));
  const [contact, setContact] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // amenities removed per UI change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        rent: Number(rent),
        city,
        locality,
        state: stateField,
        category,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area_sqft: Number(areaSqft),
        furnishing,
        available_from: availableFrom,
        contact,
      };
      if (photoData) payload.image_url = photoData;
      const res = await createProperty(payload);
      const created = res?.data || res;
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      alert(err?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h2 className={styles.title}>Add New Property</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className={styles.input} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input className={styles.input} placeholder="Rent" value={rent} onChange={(e) => setRent(e.target.value)} required type="number" />
          <input className={styles.input} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input className={styles.input} placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} required />
          <input className={styles.input} placeholder="State" value={stateField} onChange={(e) => setStateField(e.target.value)} required />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <select className={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Studio</option>
              <option>Villa</option>
            </select>
            <select className={styles.input} value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
              <option>Furnished</option>
              <option>Semi-Furnished</option>
              <option>Unfurnished</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input className={styles.input} placeholder="Bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required type="number" />
            <input className={styles.input} placeholder="Bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required type="number" />
          </div>

          <input className={styles.input} placeholder="Area (sqft)" value={areaSqft} onChange={(e) => setAreaSqft(e.target.value)} required type="number" />
          <input className={styles.input} placeholder="Available from" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required type="date" />
          <input className={styles.input} placeholder="Contact number or email" value={contact} onChange={(e) => setContact(e.target.value)} required />

          {/* Amenities removed per request */}

          <div style={{ marginTop: 8 }}>
            <input
              id="photoInput"
              className={styles.fileInputHidden}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                setPhotoPreview(URL.createObjectURL(f));
                const reader = new FileReader();
                reader.onload = () => setPhotoData(reader.result);
                reader.readAsDataURL(f);
              }}
            />
            <label htmlFor="photoInput" className={styles.fileButton}>Choose Photo</label>
          </div>

          {photoPreview && (
            <div className={styles.preview}>
              <img src={photoPreview} alt="preview" style={{ maxWidth: '240px', borderRadius: 8 }} />
            </div>
          )}

          <div>
            <button className={styles.button} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Listing'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
