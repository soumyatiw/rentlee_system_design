import React from 'react';
import styles from './StatsSection.module.css';

const stats = [
  { number: '50K+', label: 'Active Rentals' },
  { number: '100K+', label: 'Happy Renters' },
  { number: '25+', label: 'Cities Covered' },
  { number: '4.8/5', label: 'Average Rating' },
];

const StatsSection = () => {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statBox} data-aos="fade-up"
          data-aos-delay={index * 200}>
            <h2 className={styles.statNumber}>{stat.number}</h2>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
