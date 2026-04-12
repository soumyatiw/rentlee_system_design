'use client';

import React, { useState } from 'react';
import Footer from '@/components/Footer';
import BlogHeroSection from '@/components/BlogHeroSection';
import BlogCard from '@/components/BlogCard';

function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <BlogHeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BlogCard searchQuery={searchQuery} />
      <Footer />
    </div>
  );
}

export default Blog;