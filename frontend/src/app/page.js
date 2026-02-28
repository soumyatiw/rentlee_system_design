import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonial";
import StatsSection from "@/components/StatsSection";




export default function Home() {
  return (
    <div>
      <Navbar/>
      <HeroSection/>
      <FeaturedProperties/>
      <HowItWorks/>
      <StatsSection/>
      <Testimonials/>
      <Footer/>
    </div>
  );
}
