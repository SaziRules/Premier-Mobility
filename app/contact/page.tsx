"use client";

import { useState } from "react";
import ContactDetails from "@/components/ContactDetails";
import UniHero from "@/components/UniHero";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Request Call Data:", {
      name: formData.get("name"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    });
    setShowModal(false); // close after submit
  };

  return (
    <main>
      <UniHero
        videoSrc="videos/hero-video.mp4"
        title="Contact Premier Mobility"
        subtitle="Premier Mobility is always within reach. Our head office in Pietermaritzburg, along with our regional offices in Durban and Kempton Park, ensures we are accessible to clients across Southern Africa. Whether you need quick assistance, local expertise, or nationwide support, our team is ready to respond from any of these strategic locations."
        primaryBtn={{ label: "Request A Call Back", onClick: () => setShowModal(true) }}
        secondaryBtn={{ label: "Call 086 100 2477", href: "tel:0861002477" }}
      />

      <ContactDetails />

      {/* Modal for Callback */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Request A Call Back
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone Number"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-400"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-400"
                />
                <button
                  type="submit"
                  className="w-full px-5 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:from-green-400 hover:to-teal-400 transition-all"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
