"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  Bus,
  LayoutGrid,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Fleet categories (Tabs)
const tabs = [
  { key: "all", label: "All Fleet", icon: <LayoutGrid className="w-5 h-5" /> },
  { key: "specialized", label: "Specialized", icon: <Truck className="w-5 h-5" /> },
  { key: "cargo", label: "Cargo", icon: <Package className="w-5 h-5" /> },
  { key: "passenger", label: "Passenger", icon: <Bus className="w-5 h-5" /> },
];

// Fleet data (cards)
const fleetData = [
  {
    category: "specialized",
    title: "Abnormal Transportation",
    qty: "Available Units",
    image: "/fleet/abnormal.jpg",
    details: "Low weight 6x2s, ultra-heavy 6x4, 8x4, 8x6 truck-tractors.",
  },
  {
    category: "specialized",
    title: "Super Links Tautliner",
    qty: "Available Units",
    image: "/fleet/superlinks.jpg",
    details: "Normal tautliner trailers and volumax trailers for versatile cargo.",
  },
  {
    category: "cargo",
    title: "Temperature Controlled",
    qty: "Available Units",
    image: "/fleet/temperature.jpg",
    details: "4t, 8t, 14t trucks, tri-axle trucks, and 30-foot temperature trailers.",
  },
  {
    category: "cargo",
    title: "Box Body",
    qty: "Available Units",
    image: "/fleet/box-body.jpg",
    details: "Multi-door trucks, 4-ton to 30-foot trailer options.",
  },
  {
    category: "cargo",
    title: "Tippers",
    qty: "Available Units",
    image: "/fleet/tippers.jpg",
    details: "Bin sizes 20m³, 30m³, 38m³, and 45m³ for heavy material transport.",
  },
  {
    category: "cargo",
    title: "Tankers",
    qty: "Available Units",
    image: "/fleet/tankers.jpg",
    details: "Quad, tridem, and tandem semi tankers for liquids and fuels.",
  },
  {
    category: "cargo",
    title: "Flat Deck",
    qty: "Available Units",
    image: "/fleet/flat-deck.jpg",
    details: "Tri-axle flat decks for large and irregular cargo.",
  },
  {
    category: "passenger",
    title: "Passenger Vehicles",
    qty: "Available Units",
    image: "/fleet/passenger-vehicle.jpg",
    details: "Micro, sedan, hatchbacks, minibuses, and commercial buses.",
  },
];

export default function FleetOverview() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFleet =
    activeTab === "all"
      ? fleetData
      : fleetData.filter((item) => item.category === activeTab);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 lg:px-16 space-y-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="animated-gradient-text">Our Fleet</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We maintain a diverse and modern fleet of specialized vehicles to
            serve industries with precision and reliability, ensuring your cargo
            reaches its destination safely and on time.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fleet Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="wait">
            {filteredFleet.map((fleet, index) => (
              <motion.div
                key={fleet.title}
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border hover:shadow-xl transition overflow-hidden"
              >
                {/* Image */}
                <img
                  src={fleet.image}
                  alt={fleet.title}
                  className="w-full h-68 object-cover"
                />
                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {fleet.title}
                  </h3>
                  <p className="text-teal-500 font-semibold">{fleet.qty}</p>
                  <p className="text-gray-600 leading-relaxed">
                    {fleet.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
