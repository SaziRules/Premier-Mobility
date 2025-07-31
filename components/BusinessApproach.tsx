"use client";

import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function BusinessApproach() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 lg:px-16 space-y-12">
        {/* Heading & Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="animated-gradient-text">Business Approach</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We adopt a proactive, customer-centric approach by listening to
            client needs and tailoring our solutions accordingly. By leveraging
            advanced technology, transparent operations, and a skilled team, we
            consistently deliver results that foster long-term partnerships and
            exceed expectations.
          </p>
        </motion.div>

        {/* Vision & Mission Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Vision Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#0D1B2A] p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10"
          >
            {/* Icon & Divider (Centered) */}
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-400 shadow-lg">
                <motion.div
                  className="absolute inset-0 rounded-full bg-teal-400/30 blur-xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <Eye className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
              </div>
              <div className="hidden md:block w-[2px] h-20 md:h-24 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full"></div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-white space-y-4 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be the leading global provider of innovative transport and
                logistics solutions, recognized for our commitment to
                sustainability, efficiency, and exceptional service. We strive to
                connect businesses and communities seamlessly, driving growth and
                progress through adaptive logistics networks.
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            variants={itemVariants}
            className="bg-[#0D1B2A] p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10"
          >
            {/* Icon & Divider (Centered) */}
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
              <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-400 to-green-400 shadow-lg">
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-400/30 blur-xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <Target className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
              </div>
              <div className="hidden md:block w-[2px] h-20 md:h-24 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full"></div>
            </div>

            {/* Text Content */}
            <div className="flex-1 text-white space-y-4 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To deliver seamless transport and logistics solutions that empower
                clients to thrive. Our approach combines reliable services,
                cutting-edge technology, and a customer-first mindset to ensure
                every shipment is managed with precision and care.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
