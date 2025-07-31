"use client";

import { motion } from "framer-motion";

const categories = [
  {
    title: "Box Body",
    image: "/fleet/box-body.jpg",
    description:
      "Enclosed trucks designed to transport general cargo safely and securely, protecting goods from external elements during transit.",
  },
  {
    title: "Tippers",
    image: "/fleet/tippers.jpg",
    description:
      "Heavy-duty trucks equipped with hydraulically operated open-box beds for easy unloading of bulk materials like sand, gravel, or demolition waste.",
  },
  {
    title: "Tankers",
    image: "/fleet/tankers.jpg",
    description:
      "Specialized vehicles built to transport liquids and fuel safely, maintaining product integrity and meeting strict safety standards.",
  },
  {
    title: "Flat Deck",
    image: "/fleet/flat-deck.jpg",
    description:
      "Open flatbed trailers designed for transporting large or awkwardly shaped items such as building materials, machinery, and heavy equipment.",
  },
  {
    title: "Passenger Vehicles",
    image: "/fleet/passenger-vehicle.jpg",
    description:
      "A range of vehicles for transporting personnel, including sedans, hatchbacks, minibuses, and commercial buses to suit different passenger needs.",
  },
  {
    title: "Abnormal Transportation",
    image: "/fleet/abnormal.jpg",
    description:
      "Specialized transport solutions for oversized and overweight cargo, including machinery and industrial equipment requiring route clearance.",
  },
  {
    title: "Super Links Tautliner",
    image: "/fleet/superlinks.jpg",
    description:
      "Curtain-sided articulated trucks ideal for transporting palletized goods, offering fast loading and unloading efficiency.",
  },
  {
    title: "Temperature Controlled",
    image: "/fleet/temperature.jpg",
    description:
      "Refrigerated vehicles designed to maintain optimal temperature for sensitive goods such as food, pharmaceuticals, and other perishable items.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FleetCategories() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 lg:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-12"
        >
          <span className="animated-gradient-text">Our Fleet Categories</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {categories.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              <div className="w-full h-75 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
