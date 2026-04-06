'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerNormalUser } from '@/lib/api';
import styles from '../Register.module.css';

export default function RegisterUserPage() {
  const [name, setName] = useState('');
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

    try {
      await registerNormalUser({ username: name, email, password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <h2 className={styles.title}>Tenant Setup</h2>
        <p className={styles.subtitle}>Create your account to start saving properties.</p>

        <form className={styles.form} onSubmit={handleSignup}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <input type="text" placeholder="Full Name or Username" className={styles.input} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" className={styles.input} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6 chars)" className={styles.input} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <input type="password" placeholder="Confirm Password" className={styles.input} onChange={(e) => setConfirmPassword(e.target.value)} required />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
