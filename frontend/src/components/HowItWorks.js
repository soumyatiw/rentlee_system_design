import styles from './HowItWorks.module.css';
import { FiSearch, FiCalendar, FiKey } from 'react-icons/fi';

const HowItWorks = () => {
    return (
        <section className={styles.container}>
            <h2 className={styles.heading}>How Rentlee Works</h2>
            <p className={styles.subheading}>
                Find and rent your perfect property in just a few easy steps
            </p>
            <div className={styles.cards}>
                <div className={styles.card} data-aos="fade-up-right" data-aos-duration="2000">
                    <div className={styles.iconWrap}>
                        <FiSearch className={styles.icon} />
                    </div>
                    <h3>Search</h3>
                    <p>Browse listings with smart filters to discover homes that match your lifestyle.</p>
                </div>
                <div className={styles.card} data-aos="fade-up" data-aos-duration="2000">
                    <div className={styles.iconWrap}>
                        <FiCalendar className={styles.icon} />
                    </div>
                    <h3>Book a Tour</h3>
                    <p>Schedule a virtual or in-person visit with just a few clicks—anytime, anywhere.</p>
                </div>
                <div className={styles.card} data-aos="fade-up-left" data-aos-duration="2000">
                    <div className={styles.iconWrap}>
                        <FiKey className={styles.icon} />
                    </div>
                    <h3>Move In</h3>
                    <p>Apply, sign your lease, and step into your new space effortlessly.</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
