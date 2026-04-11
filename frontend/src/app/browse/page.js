'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BrowseHero from '@/components/BrowseHero';
import TagFilterSection from '@/components/TagFilterSection';
import ListingCard from '@/components/ListingCard';
import useProperties from '@/hooks/useProperties';
import styles from './Browse.module.css';
import { LayoutGrid, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';

const FullMapView = dynamic(() => import('@/components/FullMapView'), {
  ssr: false, 
});

export default function Browse() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({});
  const { properties, loading, total } = useProperties(1000, filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Pass filter callback to Hero so it can update the grid */}
        <BrowseHero onSearch={handleFilterChange} />
        
        <div className={styles.contentSection}>
          <div className={styles.topBar}>
            <div className={styles.resultsInfo}>
              <h2>Available Properties</h2>
              <p>Found <span>{total}</span> properties in your area</p>
            </div>

            <div className={styles.controls}>
              <div className={styles.viewToggle}>
                <button 
                  className={viewMode === 'grid' ? styles.active : ''} 
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={18} /> Grid
                </button>
                <button 
                  className={viewMode === 'map' ? styles.active : ''} 
                  onClick={() => setViewMode('map')}
                >
                  <MapIcon size={18} /> Map
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultsArea}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading properties...</p>
              </div>
            ) : viewMode === 'grid' ? (
              properties.length > 0 ? (
                <div className={styles.grid}>
                  {properties.map(p => (
                    <ListingCard key={p._id} property={p} />
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <h3>No properties found</h3>
                  <p>Try adjusting your search filters to find more options.</p>
                </div>
              )
            ) : (
              <div className={styles.mapContainer}>
                <FullMapView properties={properties} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}