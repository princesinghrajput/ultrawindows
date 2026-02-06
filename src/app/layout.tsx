import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ultra Windows | Premium Aluminium Windows & Doors",
  description: "Ultra Windows - UK manufactured high-quality aluminium bifold doors, sliding patio doors, glazed doors and flat roof lights. 10-year guarantee, free UK delivery.",
  keywords: [
    "aluminium windows",
    "bifold doors",
    "sliding patio doors",
    "glazed doors",
    "french doors",
    "roof lights",
    "UK manufacturer",
    "aluminium doors UK",
  ],
  authors: [{ name: "Ultra Windows & Bifolds Ltd" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.ultrawindows.co.uk",
    siteName: "Ultra Windows",
    title: "Ultra Windows | Premium Aluminium Windows & Doors",
    description: "UK manufactured high-quality aluminium bifold doors, sliding patio doors, glazed doors and flat roof lights.",
    images: [
      {
        url: "https://www.ultrawindows.co.uk/lovable-uploads/4398d2ed-0fcc-43e9-ae06-9c93ed73deaa.png",
        width: 1200,
        height: 630,
        alt: "Ultra Windows - Premium Aluminium Doors & Windows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultra Windows | Premium Aluminium Windows & Doors",
    description: "UK manufactured high-quality aluminium bifold doors, sliding patio doors, glazed doors and flat roof lights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
