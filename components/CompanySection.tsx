"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const businessUnits = [
  {
    title: "Vehicle Rental / Full Maintenance Leasing",
    content: [
      "We provide flexible vehicle rental solutions designed for both short-term and long-term business requirements. Our full maintenance leasing option ensures vehicles are always road-ready with minimal downtime.",
      "With access to a diverse fleet and proactive maintenance schedules, our rental solutions give businesses the agility to scale without worrying about fleet ownership and upkeep."
    ]
  },
  {
    title: "Linehaul",
    content: [
      "Our linehaul division offers reliable long-distance transport services ensuring goods reach their destination safely and on schedule.",
      "We utilize advanced route optimization and fleet monitoring systems to deliver efficiency and cost savings across all major routes."
    ]
  },
  {
    title: "Warehousing",
    content: [
      "Modern warehousing facilities equipped with advanced tracking systems enable seamless inventory management.",
      "We offer scalable warehousing solutions tailored to diverse industries, ensuring safety, compliance, and easy access to your goods."
    ]
  },
  {
    title: "Leasing",
    content: [
      "Premier Mobility offers flexible vehicle leasing packages, designed to meet evolving business requirements.",
      "Our leasing solutions eliminate the challenges of vehicle ownership while ensuring access to high-quality, well-maintained vehicles."
    ]
  },
  {
    title: "Distribution",
    content: [
      "We specialize in end-to-end distribution solutions, ensuring products move efficiently from origin to final destination.",
      "By integrating logistics technology and experienced personnel, we maintain high delivery accuracy and optimal customer satisfaction."
    ]
  },
  {
    title: "Cross-border Solution",
    content: [
      "Our cross-border logistics expertise ensures seamless transport between Southern African countries, handling customs and compliance with ease.",
      "We focus on minimizing transit times and providing secure movement of goods across multiple borders."
    ]
  }
];

const markets = [
  {
    title: "Fast-Moving Consumer Goods (FMCG)",
    content: [
      "Our FMCG logistics solutions are designed to handle high volume and high velocity supply chains.",
      "We prioritize timely delivery and consistent availability to keep up with dynamic market demands."
    ]
  },
  {
    title: "Food & Beverage",
    content: [
      "Specialized food and beverage logistics ensure temperature control and freshness throughout the journey.",
      "We use dedicated fleets and monitoring systems to maintain product quality and compliance."
    ]
  },
  {
    title: "Lubrication & Paint",
    content: [
      "Transporting lubrication products and paint requires strict safety measures and proper handling.",
      "We provide tailored transport solutions to minimize risk and ensure safe, compliant delivery."
    ]
  },
  {
    title: "Construction",
    content: [
      "From heavy equipment to raw materials, we support the construction sector with reliable logistics.",
      "Our fleet and expertise help meet tight deadlines and complex project schedules."
    ]
  },
  {
    title: "Mining",
    content: [
      "Our mining logistics cater to challenging terrains and remote sites with specialized transport solutions.",
      "We ensure critical materials and machinery are delivered safely and on time."
    ]
  },
  {
    title: "Abnormal Loads",
    content: [
      "We handle abnormal loads with precision and care, supported by route planning and specialized permits.",
      "Our expert teams manage oversized and overweight transport efficiently and safely."
    ]
  }
];

export default function CompanySection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const Accordion = ({ data, baseIndex = 0 }: { data: typeof businessUnits; baseIndex?: number }) => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => toggleAccordion(baseIndex + index)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="text-lg font-semibold text-gray-800">{item.title}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === baseIndex + index ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === baseIndex + index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4 bg-white text-gray-600 space-y-3"
              >
                {item.content.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed">{para}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative bg-white py-20 px-6 lg:px-16">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">
            <span className="animated-gradient-text">Our Company</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            For over 25 years, Premier Mobility has evolved from a vehicle rental company
            to a full-spectrum logistics provider, integrating multiple business units to deliver
            end-to-end supply chain solutions. Our customer-focused approach emphasizes
            efficiency, reliability, and sustainable growth for our clients.
          </p>
        </motion.div>

        {/* Right Accordions */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Our Business Units</h3>
            <Accordion data={businessUnits} baseIndex={0} />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Markets We Share</h3>
            <Accordion data={markets} baseIndex={businessUnits.length} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
