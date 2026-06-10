import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Premier Mobility",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-white px-6 py-24">
      <div className="text-center space-y-6 max-w-lg">
        <p className="text-8xl font-bold animated-gradient-text">404</p>
        <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/"
            className="px-8 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 rounded-full font-semibold border border-teal-400 text-white hover:bg-teal-400 hover:text-[#0D1B2A] transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}
