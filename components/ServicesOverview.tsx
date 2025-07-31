"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Thermometer,
  Globe2,
  ClipboardList,
  PackageCheck,
  Car,
  Warehouse,
  LineChart,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const coreServices = [
  {
    icon: <Truck className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-teal-400 to-green-400",
    title: "Abnormal Load Transport",
    description:
      "Specialized transport for oversized and overweight cargo, including escort vehicles, route planning, and compliance handling.",
  },
  {
    icon: <Thermometer className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-blue-400 to-green-400",
    title: "Temperature-Controlled Logistics",
    description:
      "Refrigerated and climate-sensitive logistics ensuring freshness and quality for perishable and pharmaceutical products.",
  },
  {
    icon: <Globe2 className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-purple-400 to-blue-400",
    title: "Cross-Border Solutions",
    description:
      "International logistics support, customs clearance, and secure cross-border transits across Southern Africa.",
  },
  {
    icon: <ClipboardList className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-pink-400 to-red-400",
    title: "Contract Logistics",
    description:
      "Full-service logistics management for long-term partners, including warehousing, distribution, and integrated fleet support.",
  },
];

const supportServices = [
  {
    icon: <PackageCheck className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-green-400 to-lime-400",
    title: "Express & Last-Mile Delivery",
    description:
      "Fast-turnaround solutions and last-mile distribution to meet tight delivery schedules and customer commitments.",
  },
  {
    icon: <Car className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-orange-400 to-yellow-400",
    title: "Fleet Leasing & Management",
    description:
      "Flexible vehicle leasing and fleet management services, designed to adapt to unique operational requirements.",
  },
  {
    icon: <Warehouse className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-indigo-400 to-teal-400",
    title: "Warehousing Solutions",
    description:
      "Secure, scalable, and technology-enabled warehousing solutions tailored to multiple industries.",
  },
  {
    icon: <LineChart className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />,
    glow: "from-cyan-400 to-green-400",
    title: "Supply Chain Consulting",
    description:
      "Expert advisory services to optimize transport routes, fleet utilization, and logistics performance.",
  },
];

export default function ServicesOverview() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-6 lg:px-16 py-20 space-y-20">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="animated-gradient-text">Our Services</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We deliver a diverse range of logistics and transport solutions
            tailored for multiple industries. From specialized cargo handling to
            end-to-end supply chain management, we ensure every project is
            executed with precision and reliability.
          </p>
        </motion.div>

        {/* Core Services (Light Section) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {coreServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#0D1B2A] p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col md:flex-row items-center gap-6"
            >
              <div
                className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${service.glow} shadow-lg`}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-teal-400/30 blur-xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
                {service.icon}
              </div>
              <div className="flex-1 text-white space-y-4 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Support Services (Dark Section) */}
        <div className="bg-[#0D1B2A] py-20 px-6 lg:px-12 rounded-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mb-12"
          >
            <h3 className="text-4xl font-bold text-white mb-6">
              Support & Value-Add Services
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our support services complement our core logistics offerings,
              providing added value and operational flexibility for clients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {supportServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-[#10243E] p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col md:flex-row items-center gap-6"
              >
                <div
                  className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${service.glow} shadow-lg`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-teal-400/30 blur-xl"
                    animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                  {service.icon}
                </div>
                <div className="flex-1 text-white space-y-4 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
