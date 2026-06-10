"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Package, X, ArrowRight, ArrowLeft, CheckCircle, User, Mail, Phone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  onClose: () => void;
}

type Step = 0 | 1 | 2 | 3;

const CARGO_TYPES = [
  "General Cargo",
  "Abnormal / Oversized Load",
  "Temperature Controlled",
  "Hazardous Materials",
  "Tanker / Liquid",
  "Tipper / Bulk Material",
  "Flat Deck / Steel / Machinery",
  "Passenger Transport",
];

const STEP_LABELS = ["Where", "When", "Cargo", "Contact"];

export default function SmartSearchBar({ onClose }: Props) {
  // Form state
  const [step, setStep] = useState<Step>(0);
  const [origin, setOrigin]             = useState("");
  const [destination, setDestination]   = useState("");
  const [pickupDate, setPickupDate]     = useState("");
  const [cargoType, setCargoType]       = useState(CARGO_TYPES[0]);
  const [cargoNotes, setCargoNotes]     = useState("");
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [phone, setPhone]               = useState("");

  const [submitting, setSubmitting]     = useState(false);
  const [success, setSuccess]           = useState(false);
  const [error, setError]               = useState("");

  // Pre-fill contact info if signed in
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("onboarding")
        .select("name, phone")
        .eq("email", user.email)
        .single();
      if (data) {
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
      }
    });
  }, []);

  const canNext = () => {
    if (step === 0) return destination.trim().length > 0;
    if (step === 1) return pickupDate.length > 0;
    if (step === 2) return cargoType.length > 0;
    return name.trim().length > 0 && email.trim().length > 0;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase.from("quote_requests").insert({
      user_id:     user?.id ?? null,
      name,
      email,
      phone:       phone || null,
      origin:      origin || null,
      destination,
      pickup_date: pickupDate,
      cargo_type:  cargoType,
      cargo_notes: cargoNotes || null,
      status:      "new",
    });

    if (dbError) {
      setError("Failed to submit. Please try again.");
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdrop}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {success ? (
          /* ── Success screen ── */
          <div className="p-10 flex flex-col items-center text-center space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
              <CheckCircle className="w-16 h-16 text-teal-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800">Request Submitted!</h2>
            <p className="text-gray-500 text-sm">
              We&apos;ve received your quote request for{" "}
              <span className="font-semibold text-gray-700">{destination}</span>.
              Our team will review it and get back to you at{" "}
              <span className="font-semibold text-gray-700">{email}</span> shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="bg-[#0D1B2A] px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">Request a Quote</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Step progress */}
              <div className="flex items-center gap-2">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div className={`flex items-center gap-1.5 ${i <= step ? "opacity-100" : "opacity-30"} transition`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        i < step ? "bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A]"
                        : i === step ? "bg-white text-[#0D1B2A]"
                        : "border border-gray-600 text-gray-500"
                      }`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className="text-xs text-gray-300 hidden sm:block">{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`flex-1 h-px transition ${i < step ? "bg-teal-400" : "bg-gray-700"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Step body ── */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* Step 0 — Where */}
                {step === 0 && (
                  <motion.div key="where" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-teal-500" />
                      <h3 className="text-lg font-bold text-gray-800">Where?</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Pickup Location <span className="text-gray-400">(optional)</span></label>
                        <input
                          type="text"
                          value={origin}
                          onChange={e => setOrigin(e.target.value)}
                          placeholder="e.g. Durban, KwaZulu-Natal"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Destination <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={destination}
                          onChange={e => setDestination(e.target.value)}
                          placeholder="e.g. Johannesburg, Gauteng"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 1 — When */}
                {step === 1 && (
                  <motion.div key="when" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-teal-500" />
                      <h3 className="text-lg font-bold text-gray-800">When?</h3>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Pickup Date <span className="text-red-400">*</span></label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-400">We&apos;ll confirm availability and provide a quote based on your schedule.</p>
                  </motion.div>
                )}

                {/* Step 2 — Cargo */}
                {step === 2 && (
                  <motion.div key="cargo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-teal-500" />
                      <h3 className="text-lg font-bold text-gray-800">Which Cargo?</h3>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Cargo Type <span className="text-red-400">*</span></label>
                      <select
                        value={cargoType}
                        onChange={e => setCargoType(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-white"
                      >
                        {CARGO_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium mb-1 block">Additional Details <span className="text-gray-400">(optional)</span></label>
                      <textarea
                        value={cargoNotes}
                        onChange={e => setCargoNotes(e.target.value)}
                        placeholder="Weight, dimensions, special handling requirements..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Contact */}
                {step === 3 && (
                  <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-teal-500" />
                      <h3 className="text-lg font-bold text-gray-800">Your Details</h3>
                    </div>

                    {/* Summary pill */}
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Route:</span> {origin ? `${origin} → ` : ""}{destination}</p>
                      <p><span className="font-medium">Date:</span> {new Date(pickupDate).toLocaleDateString("en-ZA", { day:"2-digit", month:"short", year:"numeric" })}</p>
                      <p><span className="font-medium">Cargo:</span> {cargoType}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Full Name <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Email <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Phone <span className="text-gray-400">(optional)</span></label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 82 123 4567"
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Error */}
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setStep(s => (s - 1) as Step)}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canNext() || submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 3 ? (submitting ? "Submitting…" : "Submit Request") : "Next"}
                  {step < 3 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
