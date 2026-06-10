import type { Metadata } from "next";
import InitiativesPrograms from "@/components/InitiativesPrograms";

export const metadata: Metadata = {
  title: "Our Initiatives | Premier Mobility",
  description:
    "Committed to sustainability, women empowerment, graduate programs, and community development across the logistics industry.",
};
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
