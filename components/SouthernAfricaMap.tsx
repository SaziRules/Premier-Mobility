"use client";

import { motion } from "framer-motion";
import { Globe } from "@/components/Globe";
import { useState } from "react";

// 🔹 Types
interface Location {
  lat: number;
  lon: number;
  size: number;
  label: string;
}

interface GroupedLocations {
  [region: string]: Location[];
}

// 🔹 Grouped Locations
const groupedLocations: GroupedLocations = {
  "South Africa": [
    { lat: -33.9249, lon: 18.4241, size: 0.04, label: "Cape Town — Coastal Hub" },
    { lat: -26.2041, lon: 28.0473, size: 0.05, label: "Johannesburg — Central Hub" },
    { lat: -29.8587, lon: 31.0218, size: 0.04, label: "Durban — Port Access" },
    { lat: -29.1211, lon: 26.2140, size: 0.03, label: "Bloemfontein" },
    { lat: -33.9608, lon: 25.6022, size: 0.03, label: "Gqeberha" },
    { lat: -28.7386, lon: 24.7636, size: 0.03, label: "Kimberley" },
    { lat: -31.5889, lon: 28.7844, size: 0.03, label: "East London" },
    { lat: -31.5883, lon: 28.7876, size: 0.03, label: "Mthatha" },
    { lat: -23.8962, lon: 29.4486, size: 0.03, label: "Polokwane" },
  ],
  "Neighbouring Hubs": [
    { lat: -22.5597, lon: 17.0832, size: 0.03, label: "Windhoek (Namibia)" },
    { lat: -24.6282, lon: 25.9231, size: 0.03, label: "Gaborone (Botswana)" },
    { lat: -29.3100, lon: 27.4800, size: 0.03, label: "Maseru (Lesotho)" },
    { lat: -26.3054, lon: 31.1367, size: 0.03, label: "Mbabane (Eswatini)" },
    { lat: -17.8292, lon: 31.0522, size: 0.03, label: "Harare (Zimbabwe)" },
    { lat: -20.1456, lon: 28.5873, size: 0.03, label: "Bulawayo (Zimbabwe)" },
    { lat: -25.9653, lon: 32.5892, size: 0.03, label: "Maputo (Mozambique)" },
  ],
  "Extended Network": [
    { lat: -8.8383, lon: 13.2344, size: 0.03, label: "Luanda (Angola)" },
    { lat: -15.3875, lon: 28.3228, size: 0.04, label: "Lusaka (Zambia)" },
    { lat: -11.6647, lon: 27.4794, size: 0.03, label: "Lubumbashi (DRC)" },
    { lat: -13.9626, lon: 33.7741, size: 0.03, label: "Lilongwe (Malawi)" },
    { lat: -1.2921, lon: 36.8219, size: 0.05, label: "Nairobi — Kenya" },
  ],
};

export default function SouthernAfricaMap() {
  const allMarkers: Location[] = Object.values(groupedLocations).flat();

  // 🔹 Accordion state
  const [openSection, setOpenSection] = useState<string>("South Africa");

  const toggleSection = (region: string) => {
    setOpenSection((prev) => (prev === region ? "" : region));
  };

  return (
    <section className="relative py-20 px-6 lg:px-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 text-center lg:text-left">
        
        {/* Left content */}
        <motion.div
          className="lg:w-5/12 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Our <span className="animated-gradient-text">Southern Africa</span> Network
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Premier Mobility spans multiple regions, delivering efficient logistics
              and supply chain solutions across Southern Africa’s key trade routes,
              connecting major cities and ports across borders.
            </p>
            <a
              href="/about"
              className="inline-block px-8 py-4 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:scale-105 transition"
            >
              Learn More
            </a>
          </div>

          {/* Accordion for Locations */}
          <div className="mt-10 space-y-4">
            {Object.entries(groupedLocations).map(([region, cities]) => (
              <div key={region} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(region)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-white"
                >
                  <span className="text-sm font-semibold text-gray-800">{region}</span>
                  <span className="text-gray-500">{openSection === region ? "−" : "+"}</span>
                </button>

                {/* Accordion Body */}
                {openSection === region && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {cities.map((loc: Location, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-3 py-1.5 hover:border-teal-400 transition"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-teal-400 to-green-400 flex-shrink-0"></span>
                          <span className="text-[11px] font-medium text-gray-800">{loc.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right globe */}
        <motion.div
          className="flex-1 flex justify-center relative overflow-visible"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative flex items-center justify-center w-full overflow-visible">
            <div
              className="
                w-[95%] 
                sm:w-[85%] 
                lg:w-[80%] 
                aspect-square 
                min-h-[400px] 
                sm:min-h-[500px] 
                lg:min-h-[650px] 
                overflow-visible 
                mx-auto
              "
            >
              <Globe
                markers={allMarkers.map((loc) => ({
                  location: [loc.lat, loc.lon],
                  size: loc.size,
                  label: loc.label,
                }))}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
