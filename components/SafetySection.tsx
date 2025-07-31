"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Shield, Camera, Fuel, AlertTriangle, BadgeCheck } from "lucide-react";

const securityMeasures = [
  {
    title: "24/7 Vehicle Monitoring",
    image: "/hero-fleet-2.png",
    description:
      "Our National Control Room provides 24-hour real-time monitoring of all fleet vehicles ensuring safety and accountability.",
  },
  {
    title: "External Monitoring Bureau",
    image: "/service-fleet.png",
    description:
      "Partnered external monitoring services keep an independent eye on every journey for added security and compliance.",
  },
  {
    title: "Vehicle Cameras & Ground Team",
    image: "/hero-fleet-2.png",
    description:
      "Comprehensive camera coverage and a rapid-response ground team provide extra support wherever your fleet travels.",
  },
  {
    title: "Driver Access Control",
    image: "/service-fleet.png",
    description:
      "Secure driver access control systems ensure only authorized personnel handle vehicles and sensitive cargo.",
  },
  {
    title: "Internal Escort Team",
    image: "/hero-fleet-2.png",
    description:
      "In-house vehicle escort teams provide on-route protection for sensitive or high-value cargo deliveries.",
  },
];

const securityFeatures = [
  {
    icon: <Shield className="w-6 h-6 text-[#0D1B2A]" />,
    title: "Tracking Platforms",
    description: "Triple redundancy tracking ensures your fleet is visible at all times.",
  },
  {
    icon: <Camera className="w-6 h-6 text-[#0D1B2A]" />,
    title: "Dashboard Camera",
    description: "Onboard cameras enhance driver safety and provide incident evidence.",
  },
  {
    icon: <Fuel className="w-6 h-6 text-[#0D1B2A]" />,
    title: "Fuel Tank Camera",
    description: "Monitors fuel integrity, preventing tampering and theft.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-[#0D1B2A]" />,
    title: "Panic Button x2",
    description: "Emergency dual-button system for instant alert and response.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-[#0D1B2A]" />,
    title: "Driver Tag",
    description: "Access control via driver identification for authorized use only.",
  },
];

export default function SecuritySection() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(
        () => setCurrent((prev) => (prev + 1) % securityMeasures.length),
        4000
      );
      return () => clearInterval(interval);
    }
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStart.current = e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (delta > 50) {
      setCurrent((prev) => (prev === 0 ? securityMeasures.length - 1 : prev - 1));
    } else if (delta < -50) {
      setCurrent((prev) => (prev + 1) % securityMeasures.length);
    }
    touchStart.current = null;
    setIsDragging(false);
  };

  return (
    <motion.section
      className="relative bg-gray-50 py-20 px-6 lg:px-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto space-y-16">
        {/* Heading */}
        <motion.div
          className="text-center lg:text-left space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold text-gray-900">
            Security <span className="animated-gradient-text">Features & Measures</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            We implement advanced security measures and on-vehicle technologies to ensure every delivery is safe, compliant, and reliable.
          </p>
        </motion.div>

        {/* Desktop Static Cards */}
        <motion.div
          className="hidden md:grid grid-cols-5 gap-8"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
        >
          {securityMeasures.map((measure, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col bg-white shadow hover:scale-105 transition-transform duration-300 rounded-2xl"
            >
              <img src={measure.image} alt={measure.title} className="w-full h-48 object-cover rounded-t-2xl" />
              <div className="p-4 text-left space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">{measure.title}</h3>
                <p className="text-sm text-gray-600">{measure.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Slider */}
        <div
          className="block md:hidden relative h-[420px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={() => setIsDragging(true)}
        >
          <AnimatePresence>
            {securityMeasures.map(
              (measure, index) =>
                index === current && (
                  <motion.div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full flex flex-col bg-white shadow"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img src={measure.image} alt={measure.title} className="w-full h-48 object-cover" />
                    <div className="p-4 text-left space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900">{measure.title}</h3>
                      <p className="text-sm text-gray-600">{measure.description}</p>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {securityMeasures.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  index === current ? "bg-gradient-to-r from-teal-400 to-green-400 scale-110" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Security Features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 py-10 md:pt-28 border-t border-gray-200"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
        >
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-green-400 shadow">
                {feature.icon}
              </div>
              <h4 className="text-base font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600 max-w-[180px]">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
