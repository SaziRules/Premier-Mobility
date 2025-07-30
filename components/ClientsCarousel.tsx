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
    <section className="relative flex flex-col lg:flex-row w-full">
      {/* Left Content */}
      <div className="bg-[#0D1B2A] text-white lg:w-5/12 w-full flex flex-col justify-center pl-6 md:pl-16 lg:pl-32 pr-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Trusted by <br />
          <span className="animated-gradient-text">Leading Brands</span>
        </h2>
        <p className="text-lg text-gray-300 mt-6 max-w-md">
          We are proud to partner with businesses across industries, delivering reliable mobility
          solutions and building strong relationships throughout Southern Africa and beyond.
        </p>
      </div>

      {/* Right Logos */}
      <div className="bg-white border-t border-b lg:border-l border-gray-200 lg:w-7/12 w-full flex items-center justify-center py-12 overflow-hidden">
        <motion.div
          className="flex items-center gap-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-44 h-24 flex items-center justify-center grayscale hover:grayscale-0 transition"
            >
              <img
                src={logo}
                alt={`Client ${index + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
