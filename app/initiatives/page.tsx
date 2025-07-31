"use client";

import InitiativesPrograms from "@/components/InitiativesPrograms";
import UniHero from "@/components/UniHero";

export default function InitiativesPage() {
  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        title="Our Initiatives"
        subtitle="Premier Mobility is committed to sustainability, innovation, and community development. Our initiatives focus on reducing carbon emissions, embracing green energy solutions, and supporting local communities through meaningful engagement and corporate social responsibility programs."
        primaryBtn={{ label: "Explore Initiatives", href: "#initiatives-list" }}
        secondaryBtn={{ label: "Contact Us", href: "/contact" }}
      />
      <InitiativesPrograms />
    </main>
  );
}
