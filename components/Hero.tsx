"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 0px 20px rgba(20, 184, 166, 0.5)",
    transition: { type: "spring", stiffness: 300 },
  },
  tap: { scale: 0.98 },
};

export default function Hero({
  title = "Agility + Dependability Delivered - With Premier Mobility",
  subtitle = "Providing innovative transport solutions with over 25 years of experience. From abnormal loads to specialized fleet management — we keep your business moving.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <section className="relative bg-[#0D1B2A] text-white overflow-hidden min-h-screen flex items-center pt-32 md:pt-0">

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#0d1b2a]/70 to-[#1A2A3A] opacity-90" />

        <div className="relative container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 space-y-6 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title.split("Premier Mobility")[0]}
              <br />
              <span className="animated-gradient-text">Premier Mobility</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href="/services"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="inline-block bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition"
              >
                Explore Services
              </motion.a>
              <motion.a
                href="/contact"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="inline-block border border-teal-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-teal-400 hover:text-[#0D1B2A] transition"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>

          {/* Right Compass Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 flex justify-center relative scale-90 md:scale-100"
          >
            <div className="relative flex items-center justify-center w-[85vw] max-w-[600px] aspect-square">
              {/* Compass Lines */}
              <div className="absolute w-[2px] h-full bg-gradient-to-b from-teal-400 via-transparent to-green-400 opacity-70 animate-pulse-glow" />
              <div className="absolute h-[2px] w-full bg-gradient-to-r from-teal-400 via-transparent to-green-400 opacity-70 animate-pulse-glow" />

              {/* Compass Labels */}
              <span className="absolute top-0 text-white/20 font-semibold text-sm md:text-lg -translate-y-8">N</span>
              <span className="absolute right-0 text-white/20 font-semibold text-sm md:text-lg translate-x-8">E</span>
              <span className="absolute bottom-0 text-white/20 font-semibold text-sm md:text-lg translate-y-8">S</span>
              <span className="absolute left-0 text-white/20 font-semibold text-sm md:text-lg -translate-x-8">W</span>

              {/* Rotating Rings */}
              <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-dashed border-teal-400 animate-spin-slow" />
              <div className="absolute w-full h-full rounded-full border border-green-400/50" />

              {/* Gradient Halo */}
              <div className="absolute -inset-12 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full blur-3xl" />

              {/* Main Image */}
              <div className="relative w-[80%] aspect-square rounded-full overflow-hidden shadow-2xl z-10">
                <img
                  src="/hero-fleet.png"
                  alt="Premier Mobility Fleet"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute z-20 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/80 hover:bg-white transition rounded-full shadow-xl"
                onClick={() => setShowVideo(true)}
              >
                <Play className="w-8 h-8 md:w-10 md:h-10 text-teal-500" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl">
              <video
                src="/hero-promo.mp4"
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
