"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface UniHeroProps {
  videoSrc: string;
  title: string;
  subtitle?: string;
  primaryBtn?: ButtonProps;
  secondaryBtn?: ButtonProps;
  gradientDirection?: "top" | "left" | "right" | "bottom";
  overlayOpacity?: number;
}

export default function UniHero({
  videoSrc,
  title,
  subtitle,
  primaryBtn,
  secondaryBtn,
  gradientDirection = "right",
  overlayOpacity = 0.9,
}: UniHeroProps) {
  const gradientMap: Record<typeof gradientDirection, string> = {
    top: "bg-gradient-to-t from-black to-transparent",
    bottom: "bg-gradient-to-b from-black to-transparent",
    left: "bg-gradient-to-l from-black to-transparent",
    right: "bg-gradient-to-r from-black to-black/80",
  };

  const isYoutube =
    videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be");

  const youtubeEmbed = isYoutube
    ? videoSrc
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/") +
      "?autoplay=1&mute=1&controls=0&start=60&loop=1&playlist=" +
      (videoSrc.includes("v=")
        ? videoSrc.split("v=")[1]
        : videoSrc.split("/").pop())
    : null;

  return (
    <section className="relative h-screen md:h-[65vh] w-full flex items-center text-white overflow-hidden">
      {/* Background Video with Fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {isYoutube ? (
          <iframe
            src={youtubeEmbed!}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </motion.div>

      {/* Stronger Gradient Overlay */}
      <div
        className={`absolute inset-0 ${gradientMap[gradientDirection]} z-0`}
        style={{ opacity: overlayOpacity }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="animated-gradient-text">{title}</span>
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
  {primaryBtn && (
    primaryBtn.onClick ? (
      <motion.button
        type="button"
        onClick={primaryBtn.onClick}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 20px rgba(20,184,166,0.5)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="inline-block bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition"
      >
        {primaryBtn.label}
      </motion.button>
    ) : (
      <motion.a
        href={primaryBtn.href}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 20px rgba(20,184,166,0.5)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="inline-block bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition"
      >
        {primaryBtn.label}
      </motion.a>
    )
  )}

  {secondaryBtn && (
    <motion.a
      href={secondaryBtn.href}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(20,184,166,0.5)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="inline-block border border-teal-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-teal-400 hover:text-[#0D1B2A] transition"
    >
      {secondaryBtn.label}
    </motion.a>
  )}
</div>

        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="w-8 h-8 text-white opacity-70" />
      </motion.div>
    </section>
  );
}
