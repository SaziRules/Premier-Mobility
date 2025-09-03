"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

const services = [
  { name: "Abnormal Transportation", image: "/fleet/abnormal.jpg" },
  { name: "Super Links Tautliner", image: "/fleet/superlinks.jpg" },
  { name: "Temperature Controlled", image: "/fleet/temperature.jpg" },
  { name: "Box Body & Flat Deck", image: "/fleet/box-body.jpg" },
  { name: "Tippers", image: "/fleet/tippers.jpg" },
  { name: "Tankers", image: "/fleet/tankers.jpg" },
  { name: "Passenger Vehicles", image: "/fleet/passenger-vehicle.jpg" },
  { name: "Flat Decks", image: "/fleet/flat-deck.jpg" },
];

export default function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll helper for navigation dots
  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.children[index] as HTMLElement;

      if (card) {
        const offsetLeft = card.offsetLeft - container.offsetLeft;
        container.scrollTo({ left: offsetLeft, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative bg-gray-50 py-16 px-6 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left content */}
        <div className="lg:w-4/12 w-full space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Our <span className="animated-gradient-text">Business Units</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-md">
            From vehicle rental and full maintenance to linehaul, warehousing,
            leasing, distribution, and cross-border logistics solutions — our
            fleet and expertise keep your supply chain running seamlessly
            throughout Southern Africa.
          </p>
          <a
            href="/services"
            className="inline-block px-8 py-4 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
          >
            View All Services
          </a>
        </div>

        {/* Right slider */}
        <div className="lg:w-8/12 w-full">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
          >
            {services.map((service, index) => (
              <Link
                key={index}
                href="/fleet"
                className="snap-center min-w-[240px] sm:min-w-[260px] flex-shrink-0"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  onClick={() => setActive(index)}
                  className="cursor-pointer"
                >
                  <div className="relative border rounded-2xl overflow-hidden w-full h-[320px] shadow bg-white">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 w-full border rounded-full py-3 font-medium text-gray-800 text-center bg-white shadow">
                    {service.name}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  setActive(index);
                  scrollToIndex(index);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  index === active
                    ? "bg-gradient-to-r from-teal-400 to-green-400 scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
}
