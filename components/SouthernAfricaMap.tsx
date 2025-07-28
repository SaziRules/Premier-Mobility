"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const greyShades = ["#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280"];

const locations = [
  { name: "Cape Town", x: "25%", y: "78%", major: true },
  { name: "Johannesburg", x: "60%", y: "45%", major: true },
  { name: "Durban", x: "72%", y: "60%", major: true },
  { name: "Gqeberha", x: "55%", y: "75%" },
  { name: "Bloemfontein", x: "52%", y: "60%" },
  { name: "Polokwane", x: "63%", y: "30%" },
  { name: "Nelspruit", x: "75%", y: "40%" },
  { name: "Kimberley", x: "40%", y: "55%" },
  { name: "East London", x: "60%", y: "68%" },
  { name: "Mthatha", x: "62%", y: "70%" },
  { name: "Windhoek (Namibia)", x: "10%", y: "40%" },
  { name: "Gaborone (Botswana)", x: "40%", y: "35%" },
  { name: "Harare (Zimbabwe)", x: "80%", y: "20%" },
  { name: "Bulawayo (Zimbabwe)", x: "70%", y: "30%" },
  { name: "Maputo (Mozambique)", x: "85%", y: "55%" },
  { name: "Maseru (Lesotho)", x: "58%", y: "65%" },
  { name: "Mbabane (Eswatini)", x: "78%", y: "50%" },
];

export default function MapSection() {
  const [backgroundDots, setBackgroundDots] = useState<
    { cx: number; cy: number; r: number; fill: string; opacity: number; blur: number }[]
  >([]);
  const [fontSize, setFontSize] = useState("0.75rem"); // default text-xs

  useEffect(() => {
    // Generate random background dots only on client
    const generatedDots = Array.from({ length: 40 }, () => ({
      cx: Math.random() * 700,
      cy: Math.random() * 550,
      r: Math.random() * 6 + 3,
      fill: greyShades[Math.floor(Math.random() * greyShades.length)],
      opacity: Math.random() * 0.4 + 0.1,
      blur: Math.random() * 4 + 2,
    }));
    setBackgroundDots(generatedDots);

    // Handle font size dynamically based on screen width
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setFontSize("0.6rem"); // smaller text for mobile
      } else if (window.innerWidth < 1024) {
        setFontSize("0.7rem");
      } else {
        setFontSize("0.75rem"); // default
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative py-20 px-6 lg:px-16 bg-gray-50 overflow-hidden">
      {/* Background dots */}
      {backgroundDots.length > 0 && (
        <svg
          viewBox="0 0 700 550"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="fadeGradient" cx="0%" cy="50%" r="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
          </defs>
          <rect width="700" height="550" fill="url(#fadeGradient)" />
          {backgroundDots.map((dot, index) => (
            <circle
              key={index}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={dot.fill}
              opacity={dot.opacity}
              style={{ filter: `blur(${dot.blur}px)` }}
            />
          ))}
        </svg>
      )}

      <div className="relative container mx-auto flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
        {/* Left Content */}
        <motion.div
          className="lg:w-5/12 w-full space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Our <span className="animated-gradient-text">Southern Africa</span> Network
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
            Premier Mobility spans multiple regions, delivering efficient logistics and supply chain solutions 
            across Southern Africa’s key trade routes, connecting major cities and ports across borders.
          </p>
          <a
            href="/about"
            className="inline-block px-8 py-4 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
          >
            Learn More
          </a>
        </motion.div>

        {/* Right Map - Centered on mobile */}
        <motion.div
          className="lg:w-7/12 w-full relative flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            viewBox="0 0 700 550"
            className="w-full max-w-md md:max-w-lg lg:max-w-none h-auto"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            <defs>
              <linearGradient id="dotGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>

            {locations.map((loc, index) => {
              const cx = parseFloat(loc.x) * 7;
              const cy = parseFloat(loc.y) * 5.5;
              const duration = Math.random() * 1.5 + 1.5;
              const delay = Math.random() * 2;
              return (
                <motion.circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={loc.major ? 10 : 7}
                  fill="url(#dotGradient)"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration,
                    delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </svg>

          {/* Labels */}
          {locations.map((loc, index) => (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                top: `calc(${loc.y} - 20px)`,
                left: `calc(${loc.x} + 20px)`,
                transform: "translate(-50%, -50%)",
                fontSize,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: index * 0.05,
              }}
            >
              <span className="font-semibold text-gray-800 bg-white px-2 py-1 rounded-full shadow whitespace-nowrap">
                {loc.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
