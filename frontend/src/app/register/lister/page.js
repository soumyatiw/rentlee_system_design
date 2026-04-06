'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerLister } from '@/lib/api';
import Link from 'next/link';
import styles from '../Register.module.css';

export default function RegisterListerPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', company: '', description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await registerLister({ 
        username: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      // We purposefully block redirecting and do NOT log them in due to pending bounds.
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'An error occurred during your application submission.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.cardContainer} style={{ padding: '60px 40px' }}>
          <div className={styles.icon} style={{ color: '#b45309', fontSize: '60px' }}>⏳</div>
          <h2 className={styles.title}>Application Submitted</h2>
          <p className={styles.subtitle} style={{ marginBottom: '40px', lineHeight: '1.6' }}>
            Your account is currently under review by our administration team. 
            We will notify you at <strong>{formData.email}</strong> once your access has been approved.
          </p>
          <Link href="/" className={styles.button} style={{ display: 'inline-block', textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <h2 className={styles.title}>Lister Application</h2>
        <p className={styles.subtitle}>Apply to host property listings on Rentlee.</p>

        <form className={styles.form} onSubmit={handleSignup}>
          {error && <div className={styles.error}>{error}</div>}

          <input name="name" type="text" placeholder="Full Name or Agency Name" className={styles.input} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Business Email Address" className={styles.input} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" className={styles.input} onChange={handleChange} required minLength={6} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" className={styles.input} onChange={handleChange} required />
          
          <input name="phone" type="tel" placeholder="Phone Number" className={styles.input} onChange={handleChange} required />
          <input name="company" type="text" placeholder="Company / Agency (Optional)" className={styles.input} onChange={handleChange} />
          
          <textarea 
            name="description" 
            placeholder="Brief description of the properties you manage (max 300 chars)" 
            className={styles.input} 
            onChange={handleChange} 
            required 
            maxLength={300}
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
