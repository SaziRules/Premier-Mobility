"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const services = [
  { name: "Abnormal Transportation", image: "/service-fleet.png" },
  { name: "Super Links Tautliner", image: "/service-fleet.png" },
  { name: "Temperature Controlled", image: "/service-fleet.png" },
  { name: "Box Body & Flat Deck", image: "/service-fleet.png" },
  { name: "Tippers", image: "/service-fleet.png" },
  { name: "Tankers", image: "/service-fleet.png" },
  { name: "Passenger Vehicles", image: "/service-fleet.png" },
];

export default function ServicesShowcase() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPosition = (index: number) => {
    const offset = (index - current + services.length) % services.length;
    if (offset === 0) return { scale: 1, opacity: 1, x: -150, zIndex: 30 };
    if (offset === 1) return { scale: 1, opacity: 1, x: 150, zIndex: 30 };
    if (offset === 2) return { scale: 0.8, opacity: 0.4, x: 450, zIndex: 20 };
    if (offset === services.length - 1)
      return { scale: 0.8, opacity: 0.4, x: -450, zIndex: 20 };
    return { scale: 0.5, opacity: 0, x: 0, zIndex: 10 };
  };

  return (
    <section className="relative bg-gray-50 py-20 px-6 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left content */}
        <div className="lg:w-4/12 w-full space-y-6">
          <h2 className="text-6xl font-bold text-gray-900">
            Our <span className="animated-gradient-text">Business Units</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-md">
            From vehicle rental and full maintenance to linehaul, warehousing, leasing, distribution, and cross‑border logistics solutions — our fleet and expertise keep your supply chain running seamlessly throughout Southern Africa.
          </p>
          <a
            href="/services"
            className="inline-block px-8 py-4 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
          >
            View All Services
          </a>
        </div>

        {/* Right slider */}
        <div className="lg:w-8/12 w-full relative">
          <div className="relative flex items-center justify-center h-[420px] w-full">
            {services.map((service, index) => {
              const pos = getPosition(index);
              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute w-[260px] cursor-pointer"
                  initial={false}
                  animate={pos}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  style={{ zIndex: pos.zIndex }}
                >
                  <motion.div
                    animate={
                      hovered === index
                        ? { scale: 1.05, y: -10 }
                        : { scale: 1, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative border border-black rounded-4xl overflow-hidden w-[260px] h-[350px] shadow-md bg-white"
                  >
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700"
                    />
                  </motion.div>
                  <motion.div
                    animate={
                      hovered === index
                        ? { scale: 1.1, y: -10 }
                        : { scale: 1, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mt-2 w-full border rounded-full py-4 font-medium text-gray-800 text-center bg-white shadow"
                  >
                    {service.name}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  index === current
                    ? "bg-gradient-to-r from-teal-400 to-green-400 scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
