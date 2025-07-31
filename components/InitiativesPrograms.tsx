"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Users, GraduationCap, Briefcase, BookOpen } from "lucide-react";

const initiatives = [
  {
    title: "Women Empowerment Program",
    icon: <Users className="w-7 h-7 text-white" />,
    description:
      "Diversity, inclusion, and representation initiatives supporting women-owned logistics companies and female drivers.",
    details: [
      "Focus groups to understand pain points for female-owned SMEs in logistics.",
      "Owner-driver program and women driver initiative.",
      "Promotes female leaders and equal representation in operations.",
    ],
  },
  {
    title: "Student & Education Support",
    icon: <BookOpen className="w-7 h-7 text-white" />,
    description:
      "Adopt-a-school programs, Matric exam support, and exposure to logistics through industry site visits.",
    details: [
      "Sponsor Matric exam camping season and Grade 10–12 Maths & Sciences online programs.",
      "Site visits / DILO exposure within operations and client locations.",
      "Creates early awareness and opportunities for high school students.",
    ],
  },
  {
    title: "Graduate & Internship Program",
    icon: <GraduationCap className="w-7 h-7 text-white" />,
    description:
      "Structured 1-year internships and bursary sponsorship programs for logistics graduates.",
    details: [
      "Internships for unemployed graduates to gain industry experience.",
      "Linked to the Adopt-a-School program to provide tertiary funding.",
      "Supports tax incentives for employers and work experience for graduates.",
    ],
  },
  {
    title: "Mentorship & Coaching Platforms",
    icon: <Briefcase className="w-7 h-7 text-white" />,
    description:
      "Dedicated mentorship and coaching platforms that extend across the logistics industry.",
    details: [
      "Mentorship and coaching platforms for career guidance and leadership development.",
      "Focus on women leaders and inclusion initiatives within logistics.",
      "Supports skill building for long-term industry impact.",
    ],
  },
];

export default function InitiativesPrograms() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 space-y-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center lg:text-left"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="animated-gradient-text">
              Key Initiatives & Programs
            </span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            We proudly support empowerment, education, mentorship, and inclusion
            across our industry. Our initiatives aim to create opportunities,
            develop talent, and promote diversity within logistics and transport.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Compass Video Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center relative"
          >
            <div className="relative flex items-center justify-center w-[70vw] max-w-sm sm:max-w-md lg:max-w-lg aspect-square">
              {/* Rotating Dashed Ring */}
              <div className="absolute w-full h-full rounded-full border-2 border-dashed border-teal-400 animate-spin-slow z-0" />
              {/* Static Inner Ring */}
              <div className="absolute w-[90%] h-[90%] rounded-full border border-green-400/50 z-0" />
              {/* Cross Lines */}
              <div className="absolute w-[2px] h-full bg-gradient-to-b from-teal-400 to-green-400 opacity-40 z-0" />
              <div className="absolute h-[2px] w-full bg-gradient-to-r from-teal-400 to-green-400 opacity-40 z-0" />
              {/* Compass Labels */}
              <span className="absolute top-0 text-teal-400/30 font-semibold text-sm -translate-y-6">N</span>
              <span className="absolute right-0 text-teal-400/30 font-semibold text-sm translate-x-6">E</span>
              <span className="absolute bottom-0 text-teal-400/30 font-semibold text-sm translate-y-6">S</span>
              <span className="absolute left-0 text-teal-400/30 font-semibold text-sm -translate-x-6">W</span>
              {/* Glow */}
              <div className="absolute -inset-12 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full blur-3xl z-0" />
              {/* Thumbnail Image */}
              <div className="relative w-[80%] aspect-square rounded-full overflow-hidden shadow-2xl z-10">
                <img
                  src="/initiative-thumb.png"
                  alt="Initiatives Video Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVideo(true)}
                className="absolute z-20 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/80 hover:bg-white cursor-pointer transition rounded-full shadow-xl"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-500" />
              </motion.button>
            </div>
          </motion.div>

          {/* Accordion */}
          <div className="space-y-6">
            {initiatives.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border hover:shadow-lg transition"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-400 to-green-400 shadow-md shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-3xl font-light text-teal-500 self-end sm:self-auto">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-gray-700 space-y-3"
                    >
                      {item.details.map((point, i) => (
                        <p key={i} className="leading-relaxed text-sm md:text-base">
                          {point}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Video */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/v2XlEAieCXY?autoplay=1"
                title="Initiatives Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
