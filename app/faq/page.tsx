import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Premier Mobility",
  description:
    "Frequently asked questions about Premier Mobility's transport and logistics services across Southern Africa.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-white px-6 py-24">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="animated-gradient-text">FAQs</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Our frequently asked questions page is coming soon. For any queries,
          please contact us directly — our team is ready to assist.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}
