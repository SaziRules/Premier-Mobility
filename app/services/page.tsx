"use client";

import UniHero from "@/components/UniHero";

export default function ServicesPage() {
  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        title="Our Services"
        subtitle="From specialized fleet rental and maintenance leasing to complex cross‑border logistics, warehousing, and high‑capacity linehaul transport, we deliver solutions designed to keep supply chains efficient and reliable. Our integrated approach ensures businesses have the flexibility, security, and scalability needed to thrive in today's fast‑paced markets."
        primaryBtn={{ label: "View Business Units", href: "#business-units" }}
        secondaryBtn={{ label: "Contact Us", href: "/contact" }}
      />
    </main>
  );
}
