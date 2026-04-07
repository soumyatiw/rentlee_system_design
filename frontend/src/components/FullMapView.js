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

  // Group properties by city
  const grouped = useMemo(() => {
    const map = {};
    const propertyArray = Array.isArray(properties) ? properties : properties?.data || [];
    
    propertyArray.forEach((prop) => {
      if (!prop.city) return;
      
      const key = prop.city;
      if (!map[key]) {
        map[key] = {
           city: prop.city,
           latitude: prop.latitude || 22.9734,
           longitude: prop.longitude || 78.6569,
           properties: []
        };
      }
      map[key].properties.push(prop);
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

        {Object.values(grouped).map((group, idx) => {
          return (
            <Marker
              key={idx}
              position={[group.latitude, group.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedCoords(group.city),
              }}
            >
              <Popup>
                📍 {group.properties.length} Property{group.properties.length > 1 ? 'ies' : ''} in {group.city}
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
                <MapPin size={16} /> Properties in {selectedCoords}
              </h3>
              {grouped[selectedCoords]?.properties?.map((prop, index) => (
                <div key={index} className={styles.card}>
                  <img src={prop.image_url} alt={prop.title} />
                  <div>
                    <h4>{prop.title}</h4>
                    <p>₹{prop.rent.toLocaleString()}/mo • {prop.bedrooms}BHK • {prop.area_sqft} sqft</p>
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
