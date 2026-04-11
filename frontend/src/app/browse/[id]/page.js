'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPropertyById, saveProperty, unsaveProperty } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';
import styles from './PropertyDetails.module.css';
import { 
  MapPin, BedDouble, Bath, Ruler, Heart, MessageCircle, 
  Share2, ChevronLeft, CalendarDays, Sofa, CheckCircle2, Phone
} from 'lucide-react';
import useSavedProperties from '@/hooks/useSavedProperties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PropertyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const { isSaved, toggleSave } = useSavedProperties();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [sendingEnquiry, setSendingEnquiry] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const res = await fetchPropertyById(id);
        if (res.success) {
          setProperty(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
  }, [id]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    
    setSendingEnquiry(true);
    try {
      const res = await fetch(`http://127.0.0.1:5002/api/v1/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rentlee_token')}`
        },
        body: JSON.stringify({ propertyId: id, message: enquiryMsg || "Hi, I'm interested in this property." })
      });
      const data = await res.json();
      if (data.success) {
        alert('Enquiry sent successfully!');
        setEnquiryMsg('');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to send enquiry');
    } finally {
      setSendingEnquiry(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading property details...</div>;
  if (error || !property) return <div className={styles.error}>{error || 'Property not found'}</div>;

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <ChevronLeft size={20} /> Back
        </button>

        <div className={styles.layout}>
          <div className={styles.leftCol}>
            <div className={styles.gallery}>
              <img src={property.image_url} alt={property.title} className={styles.mainImage} />
            </div>

            <div className={styles.card}>
              <div className={styles.header}>
                <div>
                  <h1 className={styles.title}>{property.title}</h1>
                  <p className={styles.location}><MapPin size={18} /> {property.locality}, {property.city}, {property.state}</p>
                </div>
                <div className={styles.actions}>
                  <button className={styles.iconBtn} onClick={() => toggleSave(property._id)}>
                    <Heart fill={isSaved(property._id) ? '#ff4444' : 'none'} color={isSaved(property._id) ? '#ff4444' : 'currentColor'} />
                  </button>
                  <button className={styles.iconBtn}><Share2 /></button>
                </div>
              </div>

              <div className={styles.stats}>
                <div className={styles.statItem}><BedDouble /> <span>{property.bedrooms} Bedrooms</span></div>
                <div className={styles.statItem}><Bath /> <span>{property.bathrooms} Bathrooms</span></div>
                <div className={styles.statItem}><Ruler /> <span>{property.area_sqft} sqft</span></div>
              </div>

              <div className={styles.description}>
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>

              <div className={styles.amenities}>
                <h3>Amenities</h3>
                <div className={styles.amenityGrid}>
                  {property.amenities?.map((item, i) => (
                    <div key={i} className={styles.amenityItem}>
                      <CheckCircle2 size={16} /> {item}
                    </div>
                  )) || <p>No amenities listed.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.stickyCard}>
              <div className={styles.priceSection}>
                <p className={styles.priceLabel}>Monthly Rent</p>
                <h2 className={styles.price}>₹{property.rent.toLocaleString()}</h2>
              </div>

              <div className={styles.detailsList}>
                <div className={styles.detailRow}>
                  <Sofa size={18} /> <span>Furnishing</span> <strong>{property.furnishing}</strong>
                </div>
                <div className={styles.detailRow}>
                  <CalendarDays size={18} /> <span>Available From</span> <strong>{property.available_from}</strong>
                </div>
                <div className={styles.detailRow}>
                  <CheckCircle2 size={18} /> <span>Property Type</span> <strong>{property.category}</strong>
                </div>
              </div>

              <div className={styles.enquirySection}>
                <h3>Contact Host</h3>
                <div className={styles.hostInfo}>
                   <img src={property.owner?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Host'} alt="Host" className={styles.hostAvatar} />
                   <div>
                     <p className={styles.hostName}>{property.owner?.username}</p>
                     <p className={styles.hostLabel}>Owner / Agent</p>
                   </div>
                </div>

                <form className={styles.enquiryForm} onSubmit={handleEnquiry}>
                  <textarea 
                    placeholder="Message the lister..." 
                    value={enquiryMsg}
                    onChange={(e) => setEnquiryMsg(e.target.value)}
                  />
                  <button type="submit" disabled={sendingEnquiry} className={styles.enquireBtn}>
                    {sendingEnquiry ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>

                <div className={styles.divider}>OR</div>

                <button className={styles.callBtn} onClick={() => alert(`Call: ${property.contact}`)}>
                  <Phone size={18} /> View Contact Number
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
