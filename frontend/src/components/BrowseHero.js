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

export default function BrowseHero({ onSearch }) {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Any type');
  const [price, setPrice] = useState('Any price');
  const [bedrooms, setBedrooms] = useState('Any');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
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
    
    if (onSearch) {
      onSearch(filters);
      // Scroll to results
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSearching(false);
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
              <option>Studio</option>
              <option>Villa</option>
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
              <option>4+</option>
            </select>
          </div>

          <button className={styles.button} type="submit" disabled={isSearching}>
            <Search size={16} style={{ marginRight: 8 }} /> {isSearching ? 'Searching...' : 'Search Properties'}
          </button>
        </form>
      </div>

      <div className={styles.right}>
        <Image src={bheroImage} alt="Hero" className={styles.imagePlaceholder} priority />
      </div>
    </section>
  );
}
