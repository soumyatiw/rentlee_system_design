'use client';
import React from 'react'

import Footer from '@/components/Footer';
import BrowseHero from '@/components/BrowseHero';
import TagFilterSection from '@/components/TagFilterSection';
import dynamic from 'next/dynamic';

const FullMapView = dynamic(() => import('@/components/FullMapView'), {
  ssr: false, 
});

import propertyData from '@/data/main_data_with_coords.json';

function Browse() {
  return (
    <div>

      <BrowseHero/>
      <TagFilterSection/>
      <FullMapView properties={propertyData} />
      <Footer/>
    </div>
  )
}

export default Browse