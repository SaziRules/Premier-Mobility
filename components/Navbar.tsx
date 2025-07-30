"use client";

import { useState } from "react";
import { Menu, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Fleet Complement", href: "/fleet" },
    { name: "Initiatives", href: "/initiatives" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-7 left-0 w-full z-50"
    >
      {/* Match Hero's content width */}
      <div className="container mx-auto px-6 lg:px-16 flex items-center gap-4">
        {/* User Icon Circle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-md hover:shadow-lg transition"
        >
          <User className="w-6 h-6 text-gray-700" />
        </motion.div>

        {/* Main Rounded Container */}
        <div className="flex-grow flex items-center justify-between h-16 bg-white/90 backdrop-blur-md rounded-full shadow-sm px-2">
          {/* Page Links */}
          <div className="hidden md:flex items-center pl-6 space-x-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-black transition relative group"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Search Bar (Airbnb-style) */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(20,184,166,0.2)" }}
            className="hidden md:flex items-center border rounded-full shadow-sm px-2 py-2 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-sm text-gray-600 ml-2 mr-4">Where to?</span>
            <span className="w-px h-6 bg-gray-300 mr-4" />
            <span className="text-sm text-gray-600 mr-4">What date?</span>
            <span className="w-px h-6 bg-gray-300 mr-4" />
            <span className="text-sm text-gray-600">Add reference</span>
            <div className="ml-4 bg-gradient-to-r from-teal-400 to-green-400 text-white p-2 rounded-full">
              <Search className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 border p-2 rounded-full hover:shadow transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
              <User className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-inner md:hidden px-4 py-2 space-y-2 rounded-b-lg"
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-black transition"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
