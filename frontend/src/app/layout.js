import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';

import { AuthProvider } from '@/context/AuthContext';
import AOSWrapper from '@/components/AOSWrapper'; // 👈 we'll make this next

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Rentlee',
  description: 'Browse and find the perfect rental home',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <AOSWrapper>
            {children}
          </AOSWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
