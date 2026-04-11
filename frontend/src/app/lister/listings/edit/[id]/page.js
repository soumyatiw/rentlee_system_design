'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchPropertyById, updateProperty } from '@/lib/api';
import ListingForm from '@/components/ListingForm';

export default function EditListing() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProperty() {
      try {
        const res = await fetchPropertyById(id);
        if (res.success) {
          setProperty(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch property');
      } finally {
        setFetching(false);
      }
    }
    loadProperty();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await updateProperty(id, formData);
      if (res.success) {
        alert('Property updated successfully!');
        router.push('/lister/listings');
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{textAlign: 'center', padding: '100px'}}>Loading property details...</div>;

    <div className="container" style={{maxWidth: '900px', margin: '0 auto', padding: '40px 0'}}>
      <ListingForm 
        title="Edit Property Listing" 
        initialData={property}
        onSubmit={handleSubmit} 
        loading={loading} 
      />
      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <button 
          onClick={() => router.push('/lister/listings')}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem'
          }}
        >
          Cancel and Go Back
        </button>
      </div>
    </div>

}
