'use client';

import React, { useState, useEffect } from 'react';
import styles from './ListingForm.module.css';
import { Save, X, Plus, Trash2 } from 'lucide-react';

export default function ListingForm({ initialData, onSubmit, loading, title }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    city: '',
    locality: '',
    state: '',
    category: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    furnishing: 'Semi-Furnished',
    available_from: '',
    image_url: '',
    contact: '',
    amenities: [],
  });

  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        rent: initialData.rent || '',
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        area_sqft: initialData.area_sqft || '',
        amenities: initialData.amenities || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>{title}</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Basic Details</h3>
          <div className={styles.grid}>
            <div className={styles.fieldFull}>
              <label>Property Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Modern Studio in South Delhi" required />
            </div>
            <div className={styles.fieldFull}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your property..." required />
            </div>
            <div className={styles.field}>
              <label>Rent (Monthly INR)</label>
              <input type="number" name="rent" value={formData.rent} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Apartment</option>
                <option>House</option>
                <option>Condo</option>
                <option>Studio</option>
                <option>Villa</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Location</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Locality</label>
              <input name="locality" value={formData.locality} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>City</label>
              <input name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>State</label>
              <input name="state" value={formData.state} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Specifications</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Area (sq.ft)</label>
              <input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleChange}>
                <option>Furnished</option>
                <option>Semi-Furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Available From</label>
              <input type="date" name="available_from" value={formData.available_from} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Contact Number</label>
              <input name="contact" value={formData.contact} onChange={handleChange} required />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Media & Amenities</h3>
          <div className={styles.grid}>
            <div className={styles.fieldFull}>
              <label>Main Image URL</label>
              <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." required />
            </div>
            <div className={styles.fieldFull}>
              <label>Add Amenities</label>
              <div className={styles.amenityInput}>
                <input value={newAmenity} onChange={e => setNewAmenity(e.target.value)} placeholder="e.g. WiFi, Parking, Pool" />
                <button type="button" onClick={handleAddAmenity}><Plus size={20} /></button>
              </div>
              <div className={styles.tagCloud}>
                {formData.amenities.map((item, idx) => (
                  <span key={idx} className={styles.tag}>
                    {item} <X size={14} onClick={() => removeAmenity(idx)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
           <button type="submit" className={styles.submitBtn} disabled={loading}>
             <Save size={20} /> {loading ? 'Saving...' : 'Save Property'}
           </button>
        </div>
      </form>
    </div>
  );
}
