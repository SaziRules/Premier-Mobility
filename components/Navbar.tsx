"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname(); // ✅ Always run hooks first
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide navbar for dashboard pages (after hooks run)
  const isDashboard = pathname?.startsWith("/dashboard");

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Fleet Complement", href: "/fleet" },
    { name: "Initiatives", href: "/initiatives" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // If dashboard, render nothing but still after hooks executed
  if (isDashboard) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-7 left-0 w-full z-50"
    >
      <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Premier Mobility Logo" width={160} height={80} />
        </Link>

        {/* Desktop Nav */}
        <div
          className={`hidden md:flex flex-grow items-center justify-between h-16 rounded-full pr-2 mt-5 transition-all duration-300 ${
            visible ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white/40 backdrop-blur-lg shadow-md"
          }`}
        >
          <div className="flex items-center space-x-8 md:pl-8">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition group ${
                    active ? "text-black" : "text-gray-700 hover:text-black"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-[-4px] left-0 h-[2px] bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </a>
              );
            })}
          </div>

          {/* Search Bar */}
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(20,184,166,0.2)" }}
            className="flex items-center border rounded-full shadow-sm px-2 py-2 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-sm text-gray-600 ml-2 mr-4">Where to?</span>
            <span className="w-px h-6 bg-gray-300 mr-4" />
            <span className="text-sm text-gray-600 mr-4">When?</span>
            <span className="w-px h-6 bg-gray-300 mr-4" />
            <span className="text-sm text-gray-600">Which Cargo</span>
            <div className="ml-4 bg-gradient-to-r from-teal-400 to-green-400 text-white p-2 rounded-full">
              <Search className="w-4 h-4" />
            </div>
          </motion.div>
        </div>

        {/* User Icon */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`hidden md:flex items-center mt-5 justify-center w-16 h-16 rounded-full transition-all duration-300 ${
            visible ? "bg-white/90 shadow-md" : "bg-white/40 backdrop-blur-lg shadow-md"
          }`}
        >
          <User className="w-6 h-6 text-gray-700" />
        </motion.div>

        {/* Mobile Hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </motion.button>
      </div>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            variants={containerVariants}
            className="fixed inset-0 bg-white flex flex-col justify-center items-center space-y-10 z-40"
          >
            {links.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                variants={linkVariants}
                className={`relative text-2xl font-semibold transition group ${
                  pathname === link.href ? "text-black" : "text-gray-700 hover:text-black"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </motion.a>
            ))}

            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="absolute bottom-0 left-0 w-full py-5 bg-gradient-to-r from-teal-400 to-green-400 text-white text-lg font-semibold"
            >
              Close Menu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
