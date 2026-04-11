'use client';
import { useState, useEffect } from 'react';
import { fetchProperties } from '@/lib/api';

export default function useProperties(limit = 1000, filters = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        const res = await fetchProperties({ ...filters, limit });
        if (res.success && res.data?.data) {
          setProperties(res.data.data);
          setTotal(res.data.total);
        } else {
          console.error('API Error:', res.message);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProps();
  }, [limit, JSON.stringify(filters)]);

  return { properties, loading, total };
}
