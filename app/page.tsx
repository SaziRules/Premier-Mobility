import AboutAppPromo from "@/components/AboutAppPromo";
import ClientsCarousel from "@/components/ClientsCarousel";
import Hero from "@/components/Hero";
import ServicesShowcase from "@/components/ServicesShowcase";
import SouthernAfricaMap from "@/components/SouthernAfricaMap";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesShowcase />
      <AboutAppPromo />
      <SouthernAfricaMap />
      <ClientsCarousel />
    </main>
  );
}
