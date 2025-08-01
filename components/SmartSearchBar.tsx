"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Package, Search, X } from "lucide-react";

export default function SmartSearchBar() {
  const [step, setStep] = useState<"where" | "when" | "cargo" | null>(null);

  const reset = () => setStep(null);

  return (
    <div className="relative">
      {/* Main Compact Bar */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center justify-between gap-4 px-4 py-2 bg-white rounded-full shadow-md cursor-pointer w-full max-w-xl mx-auto"
        onClick={() => setStep("where")}
      >
        <span className="text-sm text-gray-600">Where to?</span>
        <span className="w-px h-6 bg-gray-300" />
        <span className="text-sm text-gray-600">When?</span>
        <span className="w-px h-6 bg-gray-300" />
        <span className="text-sm text-gray-600">Which Cargo</span>
        <div className="ml-4 bg-gradient-to-r from-teal-400 to-green-400 text-white p-2 rounded-full">
          <Search className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {step && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-16 left-0 w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 z-50"
          >
            {/* Close Button */}
            <button
              onClick={reset}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Step Content */}
            <div className="space-y-6">
              {step === "where" && (
                <motion.div
                  key="where"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-500" />
                    Select Destination
                  </h3>
                  <input
                    type="text"
                    placeholder="Enter destination..."
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <button
                    onClick={() => setStep("when")}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </motion.div>
              )}
              {step === "when" && (
                <motion.div
                  key="when"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-500" />
                    Select Date
                  </h3>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <button
                    onClick={() => setStep("cargo")}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition"
                  >
                    Next
                  </button>
                </motion.div>
              )}
              {step === "cargo" && (
                <motion.div
                  key="cargo"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-teal-500" />
                    Cargo Type
                  </h3>
                  <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400">
                    <option>General Cargo</option>
                    <option>Abnormal Loads</option>
                    <option>Temperature Controlled</option>
                    <option>Hazardous Materials</option>
                  </select>
                  <button
                    onClick={reset}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition"
                  >
                    Search
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
