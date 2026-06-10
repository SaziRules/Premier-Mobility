import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://premiermobility.co.za"),
  title: "Premier Mobility | Transport & Logistics Solutions",
  description:
    "Over 25 years of transport excellence across Southern Africa. Fleet rental, linehaul, cross-border logistics, warehousing, and supply chain solutions.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Premier Mobility",
    description:
      "Integrated transport and logistics solutions across Southern Africa.",
    siteName: "Premier Mobility",
    images: [{ url: "/hero-fleet.png", width: 1200, height: 630, alt: "Premier Mobility Fleet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premier Mobility | Transport & Logistics Solutions",
    description:
      "Over 25 years of transport excellence across Southern Africa.",
    images: ["/hero-fleet.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-transparent ">
          <Navbar />
          
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
