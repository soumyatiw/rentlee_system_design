'use client';
import { useState, useEffect } from 'react';

export default function useProperties(limit = 1000) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5002/api/v1/listings?limit=${limit}`);
        const json = await res.json();
        if (json.success && json.data?.data) {
          setProperties(json.data.data);
        } else {
          console.error('API Error:', json.message);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProps();
  }, [limit]);

  return { properties, loading };
}
