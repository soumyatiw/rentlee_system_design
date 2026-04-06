'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { syncWithBackend } from '@/lib/api';
import styles from './Signup.module.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    let firebaseUser = null;

    try {
      // 1. Firebase authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = result.user;

      // 2. Save user info to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        fullName: name,
        username: username,
        email: email
      });

      // 3. Sync with Rentlee backend to get JWT token
      await syncWithBackend(firebaseUser);

      setSuccess('Signup successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } catch (err) {
      // Clean up Firebase user if backend sync fails
      if (firebaseUser) {
        await firebaseUser.delete().catch(() => signOut(auth));
      }
      
      let errorMsg = err.message || 'An error occurred during signup';
      // Make Firebase errors more user friendly
      if (errorMsg.includes('auth/email-already-in-use')) {
        errorMsg = 'This email is already in use. Please log in.';
      } else if (errorMsg.includes('auth/weak-password')) {
        errorMsg = 'Password should be at least 6 characters.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignup}>
        <h2 className={styles.title}>Create an Account</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <input
          type="text"
          placeholder="Full Name"
          className={styles.input}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
