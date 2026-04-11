'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty } from '@/lib/api';
import ListingForm from '@/components/ListingForm';

export default function CreateListing() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await createProperty(formData);
      if (res.success) {
        alert('Property listed successfully!');
        router.push('/lister/listings');
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ListingForm 
      title="List a New Property" 
      onSubmit={handleSubmit} 
      loading={loading} 
    />
  );
}
