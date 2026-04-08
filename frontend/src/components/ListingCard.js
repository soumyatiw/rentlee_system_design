import { useState } from 'react';
import styles from './common/Button.module.css';
import modalStyles from '@/app/lister/listings/NewListing.module.css';

export default function ListingCard({ listing }) {
  const [open, setOpen] = useState(false);
  const img = listing.image_url || '/assets/hero-image.png';

  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, border: '1px solid #eee', borderRadius: 8, background: 'white' }}>
        <div style={{ flex: '0 0 140px', height: 90, overflow: 'hidden', borderRadius: 6 }}>
          <img src={img} alt={listing.title || 'property'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>{listing.title || 'Untitled'}</h3>
            <div style={{ color: '#6b63c9', fontWeight: 600 }}>₹{listing.rent || '—'}</div>
          </div>
          <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>{listing.city || listing.locality || 'Unknown'}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 13, color: '#444' }}>
            <div>{listing.bedrooms ?? '-'} bd</div>
            <div>{listing.bathrooms ?? '-'} ba</div>
            <div>{listing.area_sqft ? `${listing.area_sqft} sqft` : '-'}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <button className={styles.primary} onClick={() => setOpen(true)}>View</button>
          </div>
        </div>
      </div>

      {open && (
        <div className={modalStyles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={modalStyles.modalContent} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className={modalStyles.modalClose} onClick={() => setOpen(false)}>×</button>
            <div style={{ display: 'flex', gap: 16 }}>
              <img src={img} alt={listing.title} style={{ width: 220, height: 150, objectFit: 'cover', borderRadius: 8 }} />
              <div>
                <h3 style={{ marginTop: 0 }}>{listing.title}</h3>
                <p style={{ color: '#666' }}>{listing.locality}, {listing.city}, {listing.state}</p>
                <p><strong>₹{listing.rent}</strong> / month</p>
                <p>Bedrooms: {listing.bedrooms} • Bathrooms: {listing.bathrooms} • {listing.area_sqft} sqft</p>
                <p>Furnishing: {listing.furnishing}</p>
                <p>Available from: {listing.available_from}</p>
                <p>Contact: {listing.contact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
