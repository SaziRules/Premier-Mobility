"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_EMAILS = ["yusuf@premiergrp.co.za", "movedigital031@gmail.com"];

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const reset = (next: Mode) => {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Supabase may require email confirmation — check session
      if (!data.session) {
        setInfo("Check your email for a confirmation link, then sign in.");
        setLoading(false);
        return;
      }
      await routeAfterAuth(data.session.user.email ?? "");
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) {
        setError(signInError?.message ?? "Sign in failed. Check your credentials.");
        setLoading(false);
        return;
      }
      await routeAfterAuth(data.user.email ?? "");
    }
  };

  const routeAfterAuth = async (userEmail: string) => {
    // Check portal_admins table first (DB-managed access)
    const { data: portalCheck } = await supabase
      .from("portal_admins")
      .select("email")
      .eq("email", userEmail)
      .single();

    if (portalCheck) {
      router.push("/portal");
    } else if (ADMIN_EMAILS.includes(userEmail)) {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#132437] rounded-2xl p-8 space-y-6 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Premier Mobility" width={120} height={60} />
          <h1 className="text-2xl font-bold text-white">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-sm text-center">
            {mode === "signin"
              ? "Access your client dashboard or admin portal"
              : "Set up your account to access the portal"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => reset(m)}
              className={`flex-1 py-2.5 text-sm font-semibold transition ${
                mode === m
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password (signup only) */}
          <AnimatePresence>
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 overflow-hidden"
              >
                <label className="text-sm text-gray-400">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required={mode === "signup"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          {info && (
            <p className="text-teal-400 text-sm bg-teal-400/10 border border-teal-400/20 rounded-xl px-4 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-bold hover:opacity-90 transition disabled:opacity-50 text-sm"
          >
            {loading
              ? mode === "signin" ? "Signing in…" : "Creating account…"
              : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "signin" && (
          <p className="text-center text-gray-600 text-xs">
            New client?{" "}
            <Link href="/#onboarding" className="text-teal-400 hover:underline">
              Apply to onboard
            </Link>
          </p>
        )}
      </motion.div>
    </main>
  );
}
