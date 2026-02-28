'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import styles from './FullMapView.module.css';
import { MapPin } from 'lucide-react';
import pinIcon from '@/assets/pin.svg'; 
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext'; 

// Custom SVG marker
const customIcon = new L.Icon({
  iconUrl: pinIcon.src,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -36],
  shadowUrl: null,
});

export default function FullMapView({ properties }) {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const { user } = useAuthContext(); 
  const router = useRouter();

  const isLoggedIn = !!user; 

  // Group properties by lat/lng
  const grouped = useMemo(() => {
    const map = {};
    properties.forEach((prop) => {
      const key = `${prop.lat},${prop.lng}`;
      if (!map[key]) map[key] = [];
      map[key].push(prop);
    });
    return map;
  }, [properties]);

  return (
    <div className={styles.container}>
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.entries(grouped).map(([key, group], idx) => {
          const [lat, lng] = key.split(',').map(Number);
          return (
            <Marker
              key={idx}
              position={[lat, lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedCoords(key),
              }}
            >
              <Popup>
                📍 {group.length} Property{group.length > 1 ? 'ies' : ''} here
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {selectedCoords && (
        <div className={styles.propertyList}>
          {isLoggedIn ? (
            <>
              <h3>
                <MapPin size={16} /> Properties in {grouped[selectedCoords]?.[0]?.city || selectedCoords}
              </h3>
              {grouped[selectedCoords].map((prop, index) => (
                <div key={index} className={styles.card}>
                  <img src={prop.image_url} alt={prop.title} />
                  <div>
                    <h4>{prop.title}</h4>
                    <p>₹{prop.rent}/mo • {prop.bedrooms}BHK • {prop.area_sqft} sqft</p>
                    <p>{prop.locality}, {prop.city}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Please login to view properties in this location.</p>
              <button onClick={() => router.push('/login')} className={styles.loginButton}>
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
