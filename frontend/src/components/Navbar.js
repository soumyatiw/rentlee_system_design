'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import styles from './Navbar.module.css';
import logo from '@/assets/Logo.png';
import useAuth from '@/hooks/useAuth';
import { auth } from '@/firebase/config';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' }
  ];

  const firstLetter =
    user?.username?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase();

  if (loading) {
    return (
      <div style={{
        height: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white'
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '3px solid #5C5C99',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logoBox}>
          <Image src={logo} alt="Rentlee Logo" width={36} height={36} />
          <span className={styles.brand}>Rent<span>lee</span></span>
        </Link>

        <ul className={`${styles.links} ${isMenuOpen ? styles.show : ''}`}>
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`${styles.link} ${currentPath === link.path ? styles.active : ''}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {user ? (
          <div className={styles.userMenu}>
            <div className={styles.avatar} onClick={() => setDropdownOpen(prev => !prev)}>
              {firstLetter}
            </div>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <Link href="/profile">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}

          </div>
        ) : (
          <div className={styles.auth}>
            <Link href="/login">
              <button className={styles.dotBtn}>Login</button>
            </Link>
            <Link href="/signup">
              <button className={`${styles.dotBtn} ${styles.filled}`}>Sign Up</button>
            </Link>
          </div>
        )}

        <button className={styles.hamburger} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
