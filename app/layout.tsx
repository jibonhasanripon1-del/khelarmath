import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'খেলারমাঠ — খেলার সব খবর',
  description: 'খেলাধুলার সর্বশেষ খবর, এক জায়গায়',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Hind+Siliguri:wght@400;500;600;700&family=Teko:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
