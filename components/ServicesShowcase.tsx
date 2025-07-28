"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const services = [
  { name: "Fleet Management", image: "/hero-fleet.png" },
  { name: "Abnormal Loads", image: "/hero-fleet.png" },
  { name: "Logistics Consulting", image: "/hero-fleet.png" },
  { name: "Vehicle Rentals", image: "/hero-fleet.png" },
  { name: "Emergency Response", image: "/hero-fleet.png" },
];

export default function ServicesShowcase() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative bg-gray-50 py-20 px-6 lg:px-16">
      <div className="container mx-auto">
        {/* Left-Aligned Heading */}
        <h2 className="text-6xl font-bold text-gray-900 mb-12 text-left">
          Our <span className="animated-gradient-text">Services</span>
        </h2>

        {/* Scrollable / Wrap Container */}
        <div className="flex lg:flex-wrap lg:justify-start gap-8 overflow-x-auto lg:overflow-visible pb-6 scrollbar-hide">
          {services.map((service, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              initial={{ scale: 1, y: 0 }}
              animate={
                hovered === index
                  ? { scale: 1.1, y: -10 }
                  : { scale: 1, y: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="group cursor-pointer flex-shrink-0"
              style={{ width: "260px" }}
            >
              {/* Image Container */}
              <motion.div
                className={`relative border border-black overflow-hidden transition-all duration-300 ${
                  hovered === index ? "rounded-[7.5rem]" : "rounded-4xl"
                }`}
                style={{ width: "260px", height: "350px" }}
                animate={
                  hovered === index
                    ? { scale: 1.05 }
                    : { scale: 1 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform delay-75 duration-700 group-hover:scale-105"
                />
              </motion.div>

              {/* Button */}
              <motion.div
                className={`mt-2 w-[260px] border rounded-full py-6 font-medium text-gray-800 text-center ${
                  hovered === index
                    ? "bg-gradient-to-r from-teal-400 to-green-400 text-gray-800 border-black shadow-lg"
                    : "bg-transparent"
                }`}
                animate={
                  hovered === index
                    ? { scale: 1.1, y: -10 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {service.name}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
