'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './BrowseHero.module.css';
import bheroImage from '@/assets/browsehero.png';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { fetchProperties } from '@/lib/api';
import { MapPin, Building2, IndianRupee, BedDouble, Bath, Ruler, Sofa, CalendarDays, Search, X, Phone, LogIn, Heart } from 'lucide-react';
import useSavedProperties from '@/hooks/useSavedProperties';

export default function BrowseHero() {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Any type');
  const [price, setPrice] = useState('Any price');
  const [bedrooms, setBedrooms] = useState('Any');
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();
  const isLoggedIn = !!user;
  const { toggleSave, isSaved } = useSavedProperties();

  const handleToggleSave = async (e, id) => {
    e.stopPropagation();
    await toggleSave(id);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Convert text filters into backend parameters
    const filters = {};
    if (location) filters.city = location;
    if (type !== 'Any type') filters.category = type;
    if (bedrooms !== 'Any') filters.bedrooms = bedrooms;
    
    if (price !== 'Any price') {
      if (price === 'Under ₹10,000') filters.maxRent = 10000;
      else if (price === '₹10,000 - ₹20,000') { filters.minRent = 10000; filters.maxRent = 20000; }
      else if (price === '₹20,000 - ₹40,000') { filters.minRent = 20000; filters.maxRent = 40000; }
      else if (price === '₹40,000+') filters.minRent = 40000;
    }
    
    filters.limit = 1000;

    try {
      const res = await fetchProperties(filters);
      if (res.success && res.data?.data) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
    } catch(err) {
      console.error(err);
      setResults([]);
    }
    
    setShowPopup(true);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>Explore Your Dream Home</h1>
        <p className={styles.subtitle}>
          Browse thousands of rental properties tailored to your needs and budget.
        </p>

        <form className={styles.filters} onSubmit={handleSearch}>
          <div className={styles.field}>
            <label><MapPin size={16} /> Location</label>
            <input type="text" className={styles.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="City, neighborhood" />
          </div>

          <div className={styles.field}>
            <label><Building2 size={16} /> Property Type</label>
            <select className={styles.select} value={type} onChange={e => setType(e.target.value)}>
              <option>Any type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
            </select>
          </div>

          <div className={styles.field}>
            <label><IndianRupee size={16} /> Price Range</label>
            <select className={styles.select} value={price} onChange={e => setPrice(e.target.value)}>
              <option>Any price</option>
              <option>Under ₹10,000</option>
              <option>₹10,000 - ₹20,000</option>
              <option>₹20,000 - ₹40,000</option>
              <option>₹40,000+</option>
            </select>
          </div>

          <div className={styles.field}>
            <label><BedDouble size={16} /> Bedrooms</label>
            <select className={styles.select} value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
              <option>Any</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>

          <button className={styles.button} type="submit">
            <Search size={16} style={{ marginRight: 8 }} /> Search Properties
          </button>
        </form>
      </div>

      <div className={styles.right}>
        <Image data-aos="fade-up" data-aos-duration="2000" src={bheroImage} alt="Hero" className={styles.imagePlaceholder} />
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button onClick={() => setShowPopup(false)} className={styles.closePopup}><X size={20} /></button>

            {isLoggedIn ? (
              results.length > 0 ? (
                <div className={styles.resultsGrid}>
                  {results.map((property, idx) => (
                    <div key={property._id || idx} className={styles.resultCard}>
                      <div className={styles.imageContainer}>
                        <img src={property.image_url} alt={property.title} className={styles.resultImage} />
                        {user?.role === 'user' && (
                          <button className={styles.saveBtn} onClick={(e) => handleToggleSave(e, property._id)}>
                            <Heart fill={isSaved(property._id) ? '#ff4444' : 'none'} color={isSaved(property._id) ? '#ff4444' : 'white'} size={18} />
                          </button>
                        )}
                      </div>
                      <div className={styles.resultDetails}>
                        <h3>{property.title}</h3>
                        <p><IndianRupee size={14} /> {property.rent.toLocaleString()}/mo</p>
                        <p><MapPin size={14} /> {property.city}, {property.state}</p>
                        <p><Ruler size={14} /> {property.area_sqft} sq.ft</p>
                        <p><BedDouble size={14} /> {property.bedrooms} Beds | <Bath size={14} /> {property.bathrooms} Baths</p>
                        <p><Sofa size={14} /> {property.furnishing}</p>
                        <p><CalendarDays size={14} /> Available from {property.available_from}</p>
                        <button className={styles.callBtn}>
                          <Phone size={14} /> {property.contact}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noResult}>No properties found based on your filters.</p>
              )
            ) : (
              <div className={styles.loginPrompt}>
                <h2>Please login to view property results</h2>
                <button className={styles.loginBtn} onClick={() => router.push('/login')}>
                  <LogIn size={16} /> Login / Signup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
