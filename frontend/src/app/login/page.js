'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';
import styles from './Login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [errorType, setErrorType] = useState('error'); // 'error' | 'warning'
  const [success, setSuccess] = useState(null);
  
  const router = useRouter();
  const { login } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1. Native API call
      const { token } = await loginUser(email, password);

      // 2. Map via Context
      const decodedUser = login(token);
      
      if (!decodedUser) throw new Error('Failed to decode user authentication');

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        // Redirection routing map based on decoded role
        if (decodedUser.role === 'admin') router.push('/admin/dashboard');
        else if (decodedUser.role === 'lister') router.push('/lister/dashboard');
        else router.push('/');
        
        router.refresh();
      }, 500);
      
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      
      // Map 403 HTTP boundary errors dynamically
      if (msg.includes('awaiting')) {
        setErrorType('warning'); // Amber
      } else {
        setErrorType('error'); // Red
      }
      
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2 className={styles.title}>Login to Your Account</h2>

        {errorMsg && (
          <div className={errorType === 'warning' ? styles.warning : styles.error}>
            {errorMsg}
          </div>
        )}
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
          Don&apos;t have an account? <a href="/register" className={styles.signupLink}>Sign up</a>
        </p>
      </form>
    </div>
  );
}
