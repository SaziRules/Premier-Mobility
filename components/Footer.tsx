"use client";

import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Truck, Shield, Clock, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="bg-[#0D1B2A] text-gray-300 pt-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-6 space-y-16">
        {/* Top CTA */}
        <motion.div
          className="text-left space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white">
            Join the Premier Network
          </h2>
          <p className="text-gray-400 max-w-xl">
            Be the first to know about fleet updates, special services, and
            exclusive offers.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full sm:w-80 rounded-md sm:rounded-l-md sm:rounded-r-none bg-gray-800 text-gray-100 placeholder-gray-400 outline-none border border-gray-600 focus:border-teal-400"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold rounded-md sm:rounded-l-none hover:scale-105 transition">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Features Row */}
        <motion.div
          className="bg-[#162338] text-gray-100 py-10 px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center rounded-md"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
        >
          {[ 
            { icon: <Truck className="mx-auto mb-4 w-10 h-10 text-teal-400" />, title: "Fast Delivery", text: "Lightning-fast logistics for all your needs." },
            { icon: <Shield className="mx-auto mb-4 w-10 h-10 text-teal-400" />, title: "Secure Transport", text: "Advanced security on every fleet vehicle." },
            { icon: <Clock className="mx-auto mb-4 w-10 h-10 text-teal-400" />, title: "Reliable Fleet", text: "Modern vehicles for every logistic demand." },
            { icon: <Headphones className="mx-auto mb-4 w-10 h-10 text-teal-400" />, title: "24/7 Support", text: "Always available to assist your operations." }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {item.icon}
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm mt-2 text-gray-400">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-gray-700 pt-12"
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
          viewport={{ once: true }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h4 className="text-white font-semibold mb-4">About Premier</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              We deliver secure and reliable transport solutions across Southern
              Africa, backed by technology and a modern fleet.
            </p>
            <div className="flex gap-4 mt-6 mb-8">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] hover:scale-105 transition"
                  aria-label="social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
          {[
            {
              title: "Our Company",
              links: [
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Fleet", href: "/fleet" },
                { label: "Contact", href: "/contact" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "FAQ's", href: "/faq" },
                { label: "News & Updates", href: "/news" },
                { label: "Downloads", href: "/downloads" },
              ],
            },
            {
              title: "Contact",
              links: [
                { icon: <MapPinIcon className="w-4 h-4" />, text: "9 Grix Road, Willowton Industrial, PMB, 3201" },
                { icon: <PhoneIcon className="w-4 h-4" />, text: "+27 861 002 477" },
                { icon: <EnvelopeIcon className="w-4 h-4" />, text: "yusuf@premiergrp.co.za" },
              ],
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, idx) =>
                  "href" in link ? (
                    <li key={idx}>
                      <a href={link.href} className="hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={idx} className="flex items-center gap-2">
                      {link.icon} {link.text}
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        className="border-t border-gray-700 text-center py-6 text-sm text-gray-400 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <span>
          © {new Date().getFullYear()} Premier Mobility. All rights reserved.
        </span>
        <span className="text-gray-500">
          Built to thrive | By{" "}
          <span className="text-white/50">Move Digital</span>
        </span>
      </motion.div>
    </motion.footer>
  );
}
