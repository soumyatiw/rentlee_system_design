import React from 'react'
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import BlogHeroSection from '@/components/BlogHeroSection';
import BlogCard from '@/components/BlogCard';

function Blog() {
  return (
    <div>
      <Navbar/>
      <BlogHeroSection/>
      <BlogCard/>
      <Footer/>
    </div>
  )
}

export default Blog