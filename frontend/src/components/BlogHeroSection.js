'use client';

import styles from './BlogHeroSection.module.css';
import Image from 'next/image';
import heroImage from '@/assets/blog-hero.png'; // rename uploaded image as blog-hero.png and put in /assets

import { Search } from 'lucide-react';

export default function BlogHeroSection() {
    return (
        <section className={styles.hero}>
            <div className={styles.left}>
                <h1 className={styles.title}>Insights & Ideas for Smarter Renting</h1>
                <p className={styles.subtitle}>
                    Discover rental tips, home design hacks, legal insights, and everything you need to know before renting your next space.
                </p>

                <form className={styles.searchBox} >
                    <Search className={styles.icon} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className={styles.right}>
                <Image data-aos="fade-up" data-aos-duration="1700" src={heroImage} alt="Blog Hero" className={styles.heroImage} />
            </div>
        </section>
    );
}
