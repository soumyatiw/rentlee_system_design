'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import styles from './ListerLayout.module.css';
import { LayoutDashboard, Building2, MessageSquare, PenTool, User, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export default function ListerLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuthContext();

  const NAV_ITEMS = [
    { label: 'Overview', href: '/lister/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'My Listings', href: '/lister/listings', icon: <Building2 size={20} /> },
    { label: 'Enquiries', href: '/lister/enquiries', icon: <MessageSquare size={20} /> },
    { label: 'My Blogs', href: '/lister/blogs', icon: <PenTool size={20} /> },
    { label: 'Profile', href: '/profile', icon: <User size={20} /> },
  ];

  return (
    <ProtectedRoute allowedRoles={['lister']}>
      <div className={styles.container}>
        <Navbar />
        
        <div className={styles.wrapper}>
          <aside className={styles.sidebar}>
            <div className={styles.nav}>
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <button className={styles.logoutBtn} onClick={logout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </aside>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
