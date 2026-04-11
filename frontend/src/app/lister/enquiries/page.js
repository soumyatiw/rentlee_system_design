'use client';

import { useState, useEffect } from 'react';
import { getMyEnquiries, markEnquiryRead } from '@/lib/api';
import styles from './Enquiries.module.css';
import { Mail, MailOpen, User, Building2, Calendar } from 'lucide-react';

export default function EnquiryInbox() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const res = await getMyEnquiries();
      if (res.success) setEnquiries(res.data);
    } catch (err) {
      console.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      const res = await markEnquiryRead(id);
      if (res.success) {
        setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: 'read' } : e));
      }
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  if (loading) return <div className={styles.loading}>Checking for new messages...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Enquiry Inbox</h1>
        <p>You have {enquiries.filter(e => e.status === 'unread').length} unread enquiries.</p>
      </header>

      <div className={styles.list}>
        {enquiries.length > 0 ? enquiries.map(enquiry => (
          <div 
            key={enquiry._id} 
            className={`${styles.enquiryCard} ${enquiry.status === 'unread' ? styles.unread : ''}`}
            onClick={() => enquiry.status === 'unread' && handleRead(enquiry._id)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.propertyInfo}>
                <Building2 size={16} />
                <span>{enquiry.propertyId?.title}</span>
              </div>
              <div className={styles.dateInfo}>
                <Calendar size={14} />
                <span>{new Date(enquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.senderSection}>
              <img 
                src={enquiry.senderId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
                alt="Sender" 
                className={styles.avatar} 
              />
              <div className={styles.senderInfo}>
                <h4>{enquiry.senderId?.username}</h4>
                <p>{enquiry.senderId?.email}</p>
              </div>
              <div className={styles.statusIcon}>
                {enquiry.status === 'unread' ? <Mail size={20} color="#0070f3" /> : <MailOpen size={20} color="#64748b" />}
              </div>
            </div>

            <div className={styles.messageBox}>
              <p>{enquiry.message}</p>
            </div>

            <div className={styles.actions}>
              <a href={`mailto:${enquiry.senderId?.email}`} className={styles.replyBtn}>Reply via Email</a>
            </div>
          </div>
        )) : (
          <div className={styles.empty}>
            <p>No enquiries received yet. Make sure your listings are active!</p>
          </div>
        )}
      </div>
    </div>
  );
}
