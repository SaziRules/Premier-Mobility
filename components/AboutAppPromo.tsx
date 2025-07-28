"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const stats = [
  { label: "Years of Experience", value: 25 },
  { label: "In-house Fleet Vehicles", value: 120 },
  { label: "Happy Clients Served", value: 500 },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // Stagger delay for children
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPromo() {
  const [inView, setInView] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          controls.start("visible");
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [controls]);

  useEffect(() => {
    if (!inView) return;
    const intervals = stats.map((stat, index) =>
      setInterval(() => {
        setCounters((prev) =>
          prev.map((val, i) =>
            i === index && val < stat.value ? val + 1 : val
          )
        );
      }, 20)
    );
    return () => intervals.forEach(clearInterval);
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-br from-[#0D1B2A] via-[#10243E] to-[#0D1B2A] text-white py-16 px-4 sm:px-6 lg:px-16 overflow-hidden"
    >
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between bg-[#10243E]/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 gap-12 shadow-lg">
          
          {/* Left Content with Animation */}
          <motion.div
            className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Driving <span className="animated-gradient-text">Excellence</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0"
            >
              With over two decades of experience, Premier Mobility has redefined
              transport solutions by combining agility, dependability, and innovation
              to keep businesses moving forward with confidence.
            </motion.p>
            <motion.a
  variants={itemVariants}
  href="/about"
  whileHover={{
    scale: 1.05,
    boxShadow: "0px 0px 20px rgba(20, 184, 166, 0.5)", // Teal glow
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="inline-block bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:opacity-90 transition"
>
  Learn More
</motion.a>

          </motion.div>

          {/* Right Stats with Staggered Animation */}
          <motion.div
            className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
                  {/* Rotating gradient border */}
                  <motion.div
                    className="absolute w-full h-full rounded-full p-[3px] bg-gradient-to-tr from-teal-400 via-green-400 to-teal-400"
                    style={{
                      WebkitMask: "radial-gradient(circle, #000 70%, transparent 71%)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  />

                  {/* Pulse Glow Aura */}
                  <motion.div
                    className="absolute w-full h-full rounded-full bg-teal-400/20 blur-xl"
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Inner Circle */}
                  <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#0D1B2A] flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold">{counters[index]}+</span>
                  </div>
                </div>
                <span className="text-base sm:text-lg text-gray-300 text-center max-w-[150px] mt-4">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
