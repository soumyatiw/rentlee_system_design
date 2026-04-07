'use client';
import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import BrowseHero from '@/components/BrowseHero';
import TagFilterSection from '@/components/TagFilterSection';
import dynamic from 'next/dynamic';
import useProperties from '@/hooks/useProperties';

const FullMapView = dynamic(() => import('@/components/FullMapView'), {
  ssr: false, 
});

function Browse() {
  const { properties, loading } = useProperties(1000);

  return (
    <div>
      <BrowseHero/>
      <TagFilterSection/>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '600px' }}>
          <h2>Loading live properties from database...</h2>
        </div>
      ) : (
        <FullMapView properties={properties} />
      )}
      <Footer/>
    </div>
  )
}

export default Browse