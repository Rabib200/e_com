import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "./page";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fitandkit.shop'),
  title: {
    default: "Fit & Kit - Premium Apparel Collection",
    template: "%s | Fit & Kit"
  },
  description: "Find the Best Premium Quality Jerseys, Stylish T-shirts, and Fashionable Sportswear at Fit & Kit",
  keywords: ["apparel", "jerseys", "t-shirts", "sportswear", "fashion", "clothing", "Fit & Kit"],
  openGraph: {
    title: "Fit & Kit - Premium Apparel Collection",
    description: "Find the Best Premium Quality Jerseys, Stylish T-shirts, and Fashionable Sportswear at Fit & Kit",
    url: "https://fitandkit.shop",
    siteName: "Fit & Kit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/mainLogoCropped.jpg',
        width: 800,
        height: 600,
        alt: "Fit & Kit Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fit & Kit - Premium Apparel Collection",
    description: "Find the Best Premium Quality Jerseys, Stylish T-shirts, and Fashionable Sportswear at Fit & Kit",
    images: ['/mainLogoCropped.jpg'],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: './favicon.ico' },
      { url: './favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: './favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: './favicon.ico',
    apple: './apple-touch-icon.png',
  },
  manifest: './site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
