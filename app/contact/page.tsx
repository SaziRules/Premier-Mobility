"use client";

import { useState } from "react";
import ContactDetails from "@/components/ContactDetails";
import UniHero from "@/components/UniHero";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from("contacts").insert([{
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      type: "callback",
    }]);

    if (error) {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setTimeout(closeModal, 2500);
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
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Request A Call Back
              </h3>
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <CheckCircle className="w-14 h-14 text-green-500" />
                  <p className="text-lg font-semibold text-gray-800">Request sent!</p>
                  <p className="text-gray-500 text-sm">We&apos;ll call you back shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone Number"
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message (optional)"
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                  />
                  {submitError && (
                    <p className="text-red-500 text-sm">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-5 py-3 rounded-full font-semibold text-[#0D1B2A] bg-gradient-to-r from-teal-400 to-green-400 hover:from-green-400 hover:to-teal-400 transition-all disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
