
'use client';

import styles from './TeamSection.module.css';
import { FaLinkedin} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';


const teamMembers = [
  {
    name: 'Soumya Tiwari',
    role: 'CEO & Co-Founder',
    description:
      'Soumya brings 15 years of experience in real estate and technology, with a passion for creating user-friendly platforms.',
    image: 'https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0=',
    linkedin: 'https://www.linkedin.com/in/soumya-tiwari-766430323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    twitter: '#',
  },
  {
    name: 'Shikhar Tiwari',
    role: 'COO & Co-Founder',
    description:
      'Shikhar oversees operations and customer experience, ensuring that every interaction with Rentlee exceeds expectations.',
    image: 'https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0=',
    linkedin: 'https://www.linkedin.com/in/soumya-tiwari-766430323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    twitter: '#',
  },
  {
    name: 'Laxmi Tiwari',
    role: 'CTO',
    description:
      'Laxmi leads our technology team, building innovative solutions that make finding and managing rentals seamless.',
    image: 'https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0=',
    linkedin: 'https://www.linkedin.com/in/soumya-tiwari-766430323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    twitter: '#',
  },
  {
    name: 'Sher Bahadur Tiwari',
    role: 'CMO',
    description:
      'Sher drives our marketing strategy, focusing on building meaningful connections with our community of renters and owners.',
    image: 'https://media.istockphoto.com/id/1435566677/vector/placeholder-icon-illustration.jpg?s=612x612&w=0&k=20&c=mMfFWN3fGUOv5S75bC5tmMSzFDNoqiCQFfVoMTsC4n0=',
    linkedin: 'https://www.linkedin.com/in/soumya-tiwari-766430323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    twitter: '#',
  },
];

export default function TeamSection() {
  return (
    <section className={styles.teamSection} id='team'>
      <h2 className={styles.heading}>Meet Our Leadership Team</h2>
      <p className={styles.subheading}>
        Our diverse team brings together expertise from real estate, technology, and customer service to create the best rental experience possible.
      </p>

      <div className={styles.cardGrid} data-aos="fade-up" data-aos-duration="2000">
        {teamMembers.map((member, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.imageWrapper}>
              <img src={member.image} alt={member.name} className={styles.image} />
              <div className={styles.overlay}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
            <div className={styles.info}>
              <p>{member.description}</p>
              <div className={styles.social}>
                <a href={member.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
                <a href={member.twitter} target="_blank" rel="noreferrer">
                  <FaXTwitter />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
