import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Updates | Premier Mobility",
  description:
    "Stay up to date with the latest news, fleet updates, and industry insights from Premier Mobility.",
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-white px-6 py-24">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="animated-gradient-text">News & Updates</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Our news and updates section is coming soon. Subscribe to our
          newsletter to be the first to hear about fleet updates and special
          offers.
        </p>
        <Link
          href="/#newsletter"
          className="inline-block px-8 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
        >
          Subscribe to Newsletter
        </Link>
      </div>
    </main>
  );
}
