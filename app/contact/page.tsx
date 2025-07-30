"use client";

import UniHero from "@/components/UniHero";

export default function ContactPage() {
  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        title="Contact Premier Mobility"
        subtitle="Premier Mobility is always within reach. Our head office in Pietermaritzburg, along with our regional offices in Durban and Kempton Park, ensures we are accessible to clients across Southern Africa. Whether you need quick assistance, local expertise, or nationwide support, our team is ready to respond from any of these strategic locations."
        primaryBtn={{ label: "Get In Touch", href: "/contact-form" }}
        secondaryBtn={{ label: "Call 086 100 2477", href: "tel:0861002477" }}
      />
    </main>
  );
}
