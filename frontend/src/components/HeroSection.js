'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import heroImage from '@/assets/hero-image.png';
import { FaCheckCircle, FaLock, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { LogIn } from 'lucide-react';
import properties from '@/data/main_data.json';
import { useAuthContext } from '@/context/AuthContext';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [matchedProperties, setMatchedProperties] = useState([]);
  const { user } = useAuthContext();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) {
      setShowPopup(true);
      return;
    }

    const matches = properties.filter((p) =>
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2);

    setMatchedProperties(matches);
    setShowPopup(true);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          Find Your Perfect <span>Rental Home</span>
        </h1>
        <p className={styles.subtitle}>
          Explore thousands of verified listings with secure payments and real-time support.
        </p>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <FaMapMarkerAlt className={styles.icon} />
          <input
            type="text"
            placeholder='Search by city or location...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className={styles.tags}>
          <span><FaCheckCircle /> Verified</span>
          <span><FaLock /> Secure</span>
          <span><FaPhoneAlt /> 24x7 Support</span>
        </div>
      </div>

      <div className={styles.right}>
        <Image data-aos="fade-up" data-aos-duration="2000" src={heroImage} alt="Hero" className={styles.heroImage} />
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>×</button>

            {!user ? (
              <>
                <h3 className={styles.loginHeading}>Please login to search properties</h3>
                <button className={styles.loginBtn} onClick={() => router.push('/login')}>
                  <LogIn size={16} /> Login / Signup
                </button>
              </>
            ) : matchedProperties.length > 0 ? (
              <>
                <h3 className={styles.popupHeading}>Top Matches in {searchQuery}</h3>
                <div className={styles.resultList}>
                  {matchedProperties.map((p, i) => (
                    <div key={i} className={styles.resultCard}>
                      <img src={p.image_url} alt={p.title} className={styles.resultImage} />
                      <div className={styles.resultInfo}>
                        <h4 className={styles.resultTitle}>{p.title}</h4>
                        <p className={styles.resultText}><FaMapMarkerAlt size={14} /> {p.city}, {p.state}</p>
                        <p className={styles.resultText}>₹{p.rent.toLocaleString()}/mo</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className={styles.viewMoreBtn} onClick={() => router.push('/browse')}>
                  View More →
                </button>
              </>
            ) : (
              <h4 className={styles.noMatch}>No properties found for "{searchQuery}"</h4>
            )}
          </div>
        </div>
      )}
    </section>
  );
}