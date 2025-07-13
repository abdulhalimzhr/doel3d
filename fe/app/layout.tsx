import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Doel3D - Estimasi Biaya Cetak 3D',
  description:
    'Platform estimasi biaya cetak 3D terpercaya. Upload file STL dan dapatkan estimasi biaya secara instan.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen flex flex-col justify-between bg-background text-foreground">
          {children}
        </main>
        <footer className="text-center text-sm py-4 text-muted-foreground">
          © {new Date().getFullYear()}{' '}
          <Link
            className="font-bold"
            href="/"
          >
            Doel3D
          </Link>
          . Built with{' '}
          <Link href="https://nextjs.org/">Next.js </Link> and{' '}
          <Link href="https://nestjs.org">NestJS</Link>.
        </footer>
      </body>
    </html>
  );
}
