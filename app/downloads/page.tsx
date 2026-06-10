import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Downloads | Premier Mobility",
  description:
    "Download brochures, fleet specs, and compliance documents from Premier Mobility.",
};

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] flex items-center justify-center text-white px-6 py-24">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="animated-gradient-text">Downloads</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Our downloads section is coming soon. Brochures, fleet specifications,
          and compliance documents will be available here shortly.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
        >
          Request Documents
        </Link>
      </div>
    </main>
  );
}
