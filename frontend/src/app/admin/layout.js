'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchAdminStats } from '@/lib/api';
import styles from './Admin.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { LayoutDashboard, Clock, Building2, Home, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [pendingCount, setPendingCount] = useState(0);
  const pathname = usePathname();
  const { logout } = useAuthContext();

  useEffect(() => {
    // Basic polling or one-time fetch for stats on layout mount
    const fetchBadge = async () => {
      try {
        const statsRes = await fetchAdminStats();
        setPendingCount(statsRes.data?.pending || 0);
      } catch (err) {
        console.error('Failed to fetch pending count', err);
      }
    };
    
    fetchBadge();
    // Optional: Refresh badge every 30s
    const interval = setInterval(fetchBadge, 30000);
    return () => clearInterval(interval);
  }, [pathname]); // Refresh when navigating inside admin

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Pending Requests', path: '/admin/listers/pending', icon: <Clock size={20} />, badge: pendingCount },
    { name: 'All Listers', path: '/admin/listers', icon: <Building2 size={20} /> },
    { name: 'All Listings', path: '/admin/listings', icon: <Home size={20} /> },
    { name: 'All Users', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Rentlee Admin</h2>
          </div>
          
          <nav className={styles.navMenu}>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`${styles.navItem} ${pathname === link.path ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{link.icon}</span>
                <span className={styles.navText}>{link.name}</span>
                {link.badge > 0 && (
                  <span className={styles.badge}>{link.badge}</span>
                )}
              </Link>
            ))}
          </nav>
          
          <button className={styles.logoutBtn} onClick={logout}>
            <LogOut size={18} style={{ marginRight: 8 }} /> Logout
          </button>
        </aside>

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
