"use client";

import { motion } from "framer-motion";

export default function CompanyHistoryOnly() {
  return (
    <section className="bg-white">
      {/* Top Row - History + Image */}
      <div className="container mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Left Column: Company History */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 flex flex-col justify-center"
        >
          <h2 className="text-6xl font-bold">
            <span className="animated-gradient-text">Our History</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            For over 25 years, Premier Mobility has grown from a specialized
            vehicle rental company into a fully integrated logistics solutions
            provider. Through innovation and dedication, we have built expertise
            across multiple business units to deliver end-to-end supply chain
            solutions, driving efficiency and reliability.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Today, we proudly serve industries across Southern Africa with
            tailor-made transport, warehousing, and distribution solutions,
            ensuring every delivery is handled with precision and care.
          </p>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full h-full"
        >
          <img
            src="/infographic.png"
            alt="Premier Mobility Infographic"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
