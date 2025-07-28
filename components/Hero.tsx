"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#0D1B2A] text-white overflow-hidden pt-16">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#0d1b2a]/70 to-[#1A2A3A] opacity-90" />

      <div className="relative container mx-auto px-6 lg:px-16 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-6 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Agility + Dependability <br />
            <span className="animated-gradient-text">
              Delivered with Premier Mobility
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
            Providing innovative transport solutions with over 25 years of experience.
            From abnormal loads to specialized fleet management — we keep your business moving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/services"
              className="bg-gradient-to-r from-teal-400 to-green-400 px-6 py-3 rounded-md font-semibold text-[#0D1B2A] hover:opacity-90 transition"
            >
              Explore Services
            </a>
            <a
              href="/contact"
              className="border border-teal-400 px-6 py-3 rounded-md font-semibold hover:bg-teal-400 hover:text-[#0D1B2A] transition"
            >
              Contact Us
            </a>
          </div>
        </motion.div>

        {/* Right Circular Image with Compass Effect */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 flex justify-center relative"
        >
          {/* Compass Container */}
          <div className="relative flex items-center justify-center w-[600px] h-[600px]">
            {/* Compass Direction Lines */}
            <div className="absolute w-[2px] h-full bg-gradient-to-b from-teal-400 via-transparent to-green-400 opacity-70 animate-pulse-glow" />
            <div className="absolute h-[2px] w-full bg-gradient-to-r from-teal-400 via-transparent to-green-400 opacity-70 animate-pulse-glow" />

            {/* Compass Tick Marks */}
            <span className="absolute top-0 text-white/20 font-semibold text-lg -translate-y-8">N</span>
            <span className="absolute right-0 text-white/20 font-semibold text-lg translate-x-8">E</span>
            <span className="absolute bottom-0 text-white/20 font-semibold text-lg translate-y-8">S</span>
            <span className="absolute left-0 text-white/20 font-semibold text-lg -translate-x-8">W</span>

            {/* Rotating Compass Rings */}
            <div className="absolute w-[550px] h-[550px] rounded-full border-2 border-dashed border-teal-400 animate-spin-slow" />
            <div className="absolute w-[600px] h-[600px] rounded-full border border-green-400/50" />

            {/* Gradient Halo */}
            <div className="absolute -inset-12 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full blur-3xl" />

            {/* Main Circular Image */}
            <div className="relative w-[490px] h-[490px] rounded-full overflow-hidden shadow-2xl z-10">
              <img
                src="/hero-fleet.png"
                alt="Premier Mobility Fleet"
                className="w-full h-full object-cover"
              />
              {/* Radial Glassy Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
            </div>

            {/* Play Button Overlay */}
            <button className="absolute z-20 flex items-center justify-center w-20 h-20 bg-white/80 hover:bg-white transition rounded-full shadow-xl">
              <Play className="w-10 h-10 text-teal-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
