'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { syncWithBackend } from '@/lib/api';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Firebase authentication
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

      try {
        // 2. Sync with backend — stores Rentlee JWT in localStorage
        await syncWithBackend(firebaseUser);
      } catch (backendError) {
        // If the backend refuses the user (e.g., doesn't exist in MongoDB), 
        // sign them out of Firebase to prevent half-authenticated ghost state
        await signOut(auth);
        throw new Error(backendError.message || 'Failed to sync with Rentlee servers');
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
      
    } catch (err) {
      let errorMsg = err.message || 'Invalid email or password';
      if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/wrong-password')) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (errorMsg.includes('auth/too-many-requests')) {
        errorMsg = 'Too many failed attempts. Please try again later.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.title}>Login to Your Account</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

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

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles.signupText}>
          Don&apos;t have an account? <a href="/signup" className={styles.signupLink}>Sign up</a>
        </p>
      </form>
    </div>
  );
}
