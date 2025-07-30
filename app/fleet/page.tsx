"use client";

import UniHero from "@/components/UniHero";

export default function FleetPage() {
  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        overlayOpacity={0.9}
        title="Our Fleet"
        subtitle="Our modern, diverse fleet is designed to handle everything from everyday deliveries to specialized abnormal loads and cross‑border transport. Every vehicle is maintained to the highest safety standards and equipped with advanced monitoring systems, ensuring reliability, security, and performance for every journey."
        primaryBtn={{ label: "Explore Fleet Types", href: "#fleet-types" }}
        secondaryBtn={{ label: "Contact Us", href: "/contact" }}
      />
    </main>
  );
}
