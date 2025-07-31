"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, X } from "lucide-react";

const branches = [
  {
    name: "Head Office",
    address:
      "21 Du Toit Viljoen Road, Willowood Park, Willowton, Pietermaritzburg, 3201",
    mapUrl:
      "https://www.google.com/maps?q=21+Du+Toit+Viljoen+Road,+Willowood+Park,+Willowton,+Pietermaritzburg,+3201",
    phone: "086 100 2477",
    email: "headoffice@premiermobility.co.za",
  },
  {
    name: "Regional Office - Durban",
    address: "17 Mayville, Durban, KwaZulu Natal, 4091",
    mapUrl:
      "https://www.google.com/maps?q=17+Mayville,+Durban,+KwaZulu+Natal,+4091",
    phone: "086 100 2477",
    email: "durban@premiermobility.co.za",
  },
  {
    name: "Regional Office - Kempton Park",
    address:
      "CX 48 Industrial Park, 8 Ossewa Street, Chloorkop, Kempton Park, 1624",
    mapUrl:
      "https://www.google.com/maps?q=CX+48+Industrial+Park,+8+Ossewa+Street,+Chloorkop,+Kempton+Park,+1624",
    phone: "086 100 2477",
    email: "kempton@premiermobility.co.za",
  },
];

export default function BranchContacts() {
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Example: integrate with backend or email API
    console.log("Submitting to branch email:", selectedBranch.email, {
      name,
      email,
      message,
    });

    setSelectedBranch(null); // close modal
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6 lg:px-16 space-y-12">
        <h2 className="text-5xl font-bold mb-10 animated-gradient-text">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {branches.map((branch, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#0D1B2A] p-8 rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col md:flex-row items-center gap-8"
            >
              {/* Icon + Divider */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-green-400 shadow-lg">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <div className="hidden md:block w-[2px] h-20 bg-gray-600/50" />
              </div>

              {/* Content */}
              <div className="flex-1 text-white space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-bold">{branch.name}</h3>
                <p className="text-gray-300">{branch.address}</p>
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-5 h-5" /> {branch.phone}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:from-green-400 hover:to-teal-400 transition-all"
                  >
                    Open in Google Maps
                  </a>
                  <button
                    onClick={() => setSelectedBranch(branch)}
                    className="px-5 py-3 rounded-full font-semibold border border-teal-400 text-white hover:bg-gradient-to-r hover:from-teal-400 hover:to-green-400 hover:text-[#0D1B2A] transition-all"
                  >
                    Get In Touch
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedBranch && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
              <button
                onClick={() => setSelectedBranch(null)}
                className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Contact {selectedBranch.name}
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
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-400"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-400"
                />
                <button
                  type="submit"
                  className="w-full px-5 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:from-green-400 hover:to-teal-400 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
