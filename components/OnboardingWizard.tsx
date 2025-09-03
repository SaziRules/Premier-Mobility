"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, ArrowRight, ArrowLeft, Building, Phone, User, Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const steps = [
  {
    title: "Tell Us A Bit About Your Company",
    fields: [
      { label: "Company Name", icon: <Building className="w-5 h-5 text-teal-400" />, name: "company", type: "text", placeholder: "Premier Mobility" },
      { label: "Physical Address", icon: <Building className="w-5 h-5 text-teal-400" />, name: "address", type: "text", placeholder: "21 Du Toit Viljoen Road..." },
    ],
  },
  {
    title: "Your Contact Details",
    fields: [
      { label: "Full Name", icon: <User className="w-5 h-5 text-teal-400" />, name: "name", type: "text", placeholder: "John Doe" },
      { label: "Phone Number", icon: <Phone className="w-5 h-5 text-teal-400" />, name: "phone", type: "tel", placeholder: "+27 82 123 4567" },
      { label: "Email Address", icon: <Mail className="w-5 h-5 text-teal-400" />, name: "email", type: "email", placeholder: "example@mail.com" },
    ],
  },
  {
    title: "Credit Application Info",
    fields: [
      { label: "Company Registration Number", icon: <Building className="w-5 h-5 text-teal-400" />, name: "reg", type: "text", placeholder: "CK123456789" },
      { label: "VAT Number", icon: <Building className="w-5 h-5 text-teal-400" />, name: "vat", type: "text", placeholder: "1234567890" },
    ],
  },
  {
    title: "Review Your Information",
    fields: [],
  },
];

export default function OnboardingWizard({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const password = Math.random().toString(36).slice(-12);

      // Try creating account
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password,
      });

      if (signUpError?.message?.includes("already registered")) {
        // Sign in if already exists
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password,
        });
        if (signInError) {
          setError("This email is already registered. Please log in manually.");
          setLoading(false);
          return;
        }
      }

      // Insert onboarding record
      const { error: insertError } = await supabase.from("onboarding").insert([{
        company: formData.company,
        address: formData.address,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        reg: formData.reg,
        vat: formData.vat,
      }]);
      if (insertError) throw insertError;

      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => step > 0 && setStep(step - 1);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-[#0D1B2A] rounded-2xl shadow-2xl p-8 space-y-8 border border-white/10 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>

        {step < steps.length - 1 ? (
          <form className="space-y-6">
            {steps[step].fields.map((field, index) => (
              <div key={index} className="space-y-2">
                <label htmlFor={field.name} className="text-gray-400 text-sm">{field.label}</label>
                <div className="flex items-center bg-white/5 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-teal-400">
                  {field.icon}
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 outline-none pl-3"
                    required
                  />
                </div>
              </div>
            ))}
          </form>
        ) : (
          <div className="text-white space-y-4">
            <p className="text-lg font-semibold">Please review your details:</p>
            {Object.entries(formData).map(([key, value]) => (
              <p key={key} className="capitalize"><span className="text-gray-400">{key}: </span>{value}</p>
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-gray-400 text-sm">Submitting...</p>}

        <div className="flex justify-between items-center">
          <p className="text-sm text-white">Step {step + 1} of {steps.length}</p>
          <div className="flex gap-4">
            {step > 0 && (
              <button onClick={handleBack}
                className="px-6 py-3 rounded-full border border-gray-500 text-gray-300 hover:bg-white/10 transition flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold transition">
              {step === steps.length - 1 ? "Submit" : "Continue"} <ArrowRight className="w-4 h-4 inline-block ml-2" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
