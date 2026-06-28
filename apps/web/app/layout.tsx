import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mia.menu',
  description: 'Dijital menü ve restoran yönetim platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
