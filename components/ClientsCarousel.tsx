"use client";

import { motion } from "framer-motion";

const logos = [
  "/logos/logo1.png",
  "/logos/logo2.png",
  "/logos/logo3.png",
  "/logos/logo4.png",
  "/logos/logo5.png",
  "/logos/logo6.png",
  "/logos/logo7.png",
  "/logos/logo8.jpg",
];

export default function ClientsCarousel() {
  return (
    <section className="relative bg-gray-50 py-16 px-6 lg:px-16 overflow-hidden">
      <div className="container mx-auto text-center mb-10">
        <h2 className="text-5xl font-bold text-gray-900">
          Trusted by <span className="animated-gradient-text">Leading Brands</span>
        </h2>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          We are proud to partner with businesses across industries, delivering reliable mobility solutions.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-8 sm:gap-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-52 h-28 sm:w-44 sm:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition"
            >
              <img
                src={logo}
                alt={`Client ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
