"use client";

import AboutPromo from "@/components/AboutAppPromo";
import UniHero from "@/components/UniHero";
import CompanyHistoryAndScope from "@/components/CompanyHistoryAndScope";
import UnitsAndIndustries from "@/components/UnitsAndIndustries";
import BusinessApproach from "@/components/BusinessApproach";

export default function AboutPage() {
  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        title="About Premier Mobility"
        subtitle="With over 25 years of experience, Premier Mobility has grown from a specialized rental business into a fully integrated logistics and transport solutions provider.  we are committed to connecting businesses, ensuring operational efficiency, and driving progress throughout Southern Africa."
        primaryBtn={{ label: "Explore Services", href: "/services" }}
        secondaryBtn={{ label: "Contact Us", href: "/contact" }}
      />
      <CompanyHistoryAndScope />
      <AboutPromo />
      <BusinessApproach />
      <UnitsAndIndustries />
    </main>
  );
}
