'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import styles from './Navbar.module.css';
import logo from '@/assets/Logo.png';
import { useAuthContext } from '@/context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const router = useRouter();
  const currentPath = usePathname();
  
  const { user, loading, logout } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.refresh();
  };

  const getNavLinks = () => {
    const defaultLinks = [
      { name: 'Home', path: '/' },
      { name: 'Browse', path: '/browse' },
      { name: 'Blog', path: '/blog' }
    ];

    if (!user) return defaultLinks;

    if (user.role === 'admin') {
      return [
        ...defaultLinks,
        { name: 'Analytics', path: '/admin/dashboard' }
      ];
    }

    if (user.role === 'lister') {
      return [
        ...defaultLinks,
        { name: 'My Listings', path: '/lister/listings' }
      ];
    }

    if (user.role === 'user') {
      return [
        ...defaultLinks,
        { name: 'Saved Properties', path: '/saved' }
      ];
    }

    return defaultLinks;
  };

  const navLinks = getNavLinks();

  const firstLetter =
    user?.username?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() || 'U';

  if (loading) {
    return (
      <div style={{
        height: '64px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        borderBottom: '1px solid #eaeaea'
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

        {/* Dynamic Navigation Links based on Roles */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            {/* Add Property Button for Listers */}
            {user.role === 'lister' && (
              <Link href="/lister/listings/new">
                <button className={`${styles.dotBtn} ${styles.filled}`}>Add Property</button>
              </Link>
            )}

            <div className={styles.userMenu} ref={dropdownRef}>
              <div className={styles.avatar} onClick={() => setDropdownOpen(prev => !prev)}>
                {firstLetter}
              </div>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)}>Settings / Profile</Link>
                  {user.role === 'lister' && (
                    <Link href="/lister/blogs" onClick={() => setDropdownOpen(false)}>My Blogs</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.auth}>
            <Link href="/login">
              <button className={styles.dotBtn}>Login</button>
            </Link>
            <Link href="/register/user">
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
