"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Truck, Warehouse, Package, Building2, Hammer, Factory, Route, Rotate3DIcon, HandHelping } from "lucide-react";
import { FaBusinessTime } from "react-icons/fa";

const businessUnits = [
  {
    title: "Vehicle Rental / Full Maintenance Leasing",
    icon: <Truck className="w-8 h-8 text-teal-500" />,
    content: [
      "Flexible rental solutions designed for short- and long-term requirements, ensuring your operations are always supported by a reliable fleet.",
      "Full maintenance leasing keeps your vehicles road-ready with minimized downtime and optimal performance for every business demand."
    ]
  },
  {
    title: "Linehaul",
    icon: <Route className="w-8 h-8 text-teal-500" />,
    content: [
      "Reliable long-distance transportation services designed for safe and timely deliveries across regions.",
      "Optimized routes and advanced fleet monitoring for cost efficiency and operational reliability."
    ]
  },
  {
    title: "Warehousing",
    icon: <Warehouse className="w-8 h-8 text-teal-500" />,
    content: [
      "Secure, modern warehousing facilities integrated with advanced inventory and tracking systems.",
      "Flexible solutions tailored to businesses needing scalable, safe, and accessible storage."
    ]
  },
  {
    title: "Leasing",
    icon: <HandHelping className="w-8 h-8 text-teal-500" />,
    content: [
      "Flexible vehicle leasing designed to adapt to evolving operational needs.",
      "Leasing options reduce ownership costs while ensuring consistent fleet availability."
    ]
  },
  {
    title: "Distribution",
    icon: <FaBusinessTime className="w-8 h-8 text-teal-500" />,
    content: [
      "End-to-end distribution services that guarantee accurate, efficient, and reliable product delivery.",
      "Seamless integration with warehousing and linehaul services to enhance supply chain performance."
    ]
  },
  {
    title: "Cross-border Solution",
    icon: <Rotate3DIcon className="w-8 h-8 text-teal-500" />,
    content: [
      "Comprehensive cross-border logistics including customs handling and compliance expertise.",
      "Secure, fast transit solutions for goods moving across Southern African regions."
    ]
  }
];

const markets = [
  {
    title: "Fast-Moving Consumer Goods (FMCG)",
    icon: <Package className="w-8 h-8 text-teal-500" />,
    content: [
      "Tailored high-volume logistics solutions ensuring continuous availability for dynamic FMCG markets.",
      "Focus on fast, reliable delivery schedules to meet fast-paced consumer demand."
    ]
  },
  {
    title: "Food & Beverage",
    icon: <Package className="w-8 h-8 text-teal-500" />,
    content: [
      "Specialized food and beverage logistics ensuring safe, temperature-controlled transport.",
      "Quality-focused services designed to preserve freshness and compliance at every stage."
    ]
  },
  {
    title: "Lubrication & Paint",
    icon: <Hammer className="w-8 h-8 text-teal-500" />,
    content: [
      "Strict safety protocols for handling sensitive industrial products like lubrication and paint.",
      "Secure transportation that meets compliance standards and reduces risk."
    ]
  },
  {
    title: "Construction",
    icon: <Building2 className="w-8 h-8 text-teal-500" />,
    content: [
      "Comprehensive construction logistics supporting material delivery and heavy equipment transport.",
      "Flexible solutions adapted to tight project deadlines and complex requirements."
    ]
  },
  {
    title: "Mining",
    icon: <Factory className="w-8 h-8 text-teal-500" />,
    content: [
      "Robust logistics services designed for remote and challenging mining sites.",
      "Specialized equipment transport ensuring operational continuity and safety."
    ]
  },
  {
    title: "Abnormal Loads",
    icon: <Truck className="w-8 h-8 text-teal-500" />,
    content: [
      "Expert management for oversized and overweight cargo with route planning and permits.",
      "Safe and efficient transportation of unique, large-scale items."
    ]
  }
];

function Accordion({
  data,
  openIndex,
  setOpenIndex
}: {
  data: typeof businessUnits;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-5"
    >
      {data.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex items-center justify-between w-full px-6 py-5"
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span className="text-lg font-semibold text-gray-800">
                  {item.title}
                </span>
              </div>
              {isOpen ? (
                <Minus className="w-7 h-7 text-teal-500" />
              ) : (
                <Plus className="w-7 h-7 text-teal-500" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-5 space-y-3 text-gray-600 text-base leading-relaxed"
                >
                  {item.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function UnitsAndIndustries() {
  const [openUnit, setOpenUnit] = useState<number | null>(null);
  const [openMarket, setOpenMarket] = useState<number | null>(null);

  return (
    <section className="bg-white py-28">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Business Units */}
        <div>
          <h3 className="text-5xl font-bold mb-8">
            <span className="animated-gradient-text">Our Business Units</span>
          </h3>
          <Accordion data={businessUnits} openIndex={openUnit} setOpenIndex={setOpenUnit} />
        </div>

        {/* Markets */}
        <div>
          <h3 className="text-5xl font-bold mb-8">
            <span className="animated-gradient-text">Serviced Industries</span>
          </h3>
          <Accordion data={markets} openIndex={openMarket} setOpenIndex={setOpenMarket} />
        </div>
      </div>
    </section>
  );
}
