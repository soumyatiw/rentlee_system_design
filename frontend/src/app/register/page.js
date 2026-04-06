'use client';

import Link from 'next/link';
import styles from './Register.module.css';

export default function RegisterSelectorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <h2 className={styles.title}>Join Rentlee</h2>
        <p className={styles.subtitle}>How would you like to use our platform?</p>

        <div className={styles.optionsGrid}>
          <Link href="/register/user" className={styles.optionCard}>
            <div className={styles.icon}>🏠</div>
            <h3>I'm looking for a property</h3>
            <p>Browse listings, save favorites, and connect with landlords.</p>
          </Link>

          <Link href="/register/lister" className={styles.optionCard}>
            <div className={styles.icon}>🏢</div>
            <h3>I want to list properties</h3>
            <p>Publish your properties, manage inquiries, and find tenants.</p>
          </Link>
        </div>

        <p className={styles.loginText}>
          Already have an account? <Link href="/login" className={styles.loginLink}>Login here</Link>
        </p>
      </div>
    </div>
  );
}
