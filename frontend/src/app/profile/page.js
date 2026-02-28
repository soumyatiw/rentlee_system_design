'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const user = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  useEffect(() => {
  const loadProfile = async () => {
    if (!user || !user.uid || !db) return; // 💥 avoid running when not ready

    try {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFormData(snap.data());
      }
    } catch (err) {
      console.error('Failed to load user profile:', err.message);
    }
  };

  loadProfile();
}, [user, db]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
  e.preventDefault();

  const uid = user?.uid || auth.currentUser?.uid;

  if (!uid) {
    alert('User not ready yet. Please wait a moment.');
    return;
  }

  try {
    const ref = doc(db, 'users', uid);
    await setDoc(ref, formData);
    alert('Profile updated!');
  } catch (err) {
    console.error('Failed to save profile:', err.message);
    alert('Failed to update profile.');
  }
};


  return (
    <div className={styles.profileContainer}>
    <div className={styles.container}>
      <h1 className={styles.heading}>User Profile</h1>
      <form onSubmit={handleSave} className={styles.form}>
        <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className={styles.input} />
        <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className={styles.input} />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className={styles.input} />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={styles.input} />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className={styles.input} />
        <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className={styles.input} />
        <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className={styles.input} />
        <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className={styles.input} />
        <button type="submit" className={styles.button}>Save Profile</button>
      </form>
    </div>
    </div>
  );
}