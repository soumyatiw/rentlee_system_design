import { Poppins } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';

import ClientProviders from '@/components/ClientProviders';
import AOSWrapper from '@/components/AOSWrapper';
import Navbar from '@/components/Navbar';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});


export const metadata = {
  title: 'Rentlee',
  description: 'Browse and find the perfect rental home',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <ClientProviders>
          <AOSWrapper>
            <Navbar />
            {children}
          </AOSWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
