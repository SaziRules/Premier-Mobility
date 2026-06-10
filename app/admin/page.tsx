"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import {
  Phone,
  Mail,
  RefreshCw,
  Building2,
  Users,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react";

// ── Admin whitelist ──────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["yusuf@premiergrp.co.za", "movedigital031@gmail.com"];

// ── Types ────────────────────────────────────────────────────────────────────
interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  contact_type?: string;
  branch?: string;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface OnboardingRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  reg?: string;
  vat?: string;
  created_at: string;
}

type Tab = "contacts" | "newsletter" | "onboarding";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#132437] rounded-2xl p-6 space-y-2"
    >
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-4xl font-bold animated-gradient-text">{value}</p>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("contacts");

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingRecord[]>([]);

  const loadData = useCallback(async () => {
    const [cRes, nRes, oRes] = await Promise.all([
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter").select("*").order("created_at", { ascending: false }),
      supabase.from("onboarding").select("*").order("created_at", { ascending: false }),
    ]);
    if (cRes.data) setContacts(cRes.data);
    if (nRes.data) setSubscribers(nRes.data);
    if (oRes.data) setOnboarding(oRes.data);
  }, []);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      if (!ADMIN_EMAILS.includes(user.email ?? "")) {
        router.push("/");
        return;
      }
      setAuthorized(true);
      await loadData();
      setLoading(false);
    };
    init();
  }, [router, loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D1B2A] text-white">
        <p className="text-gray-400">Loading admin portal...</p>
      </main>
    );
  }

  if (!authorized) return null;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "contacts", label: "Contact Submissions", count: contacts.length },
    { key: "newsletter", label: "Newsletter", count: subscribers.length },
    { key: "onboarding", label: "Onboarding", count: onboarding.length },
  ];

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Premier Mobility" width={120} height={60} />
            <div>
              <h1 className="text-2xl font-bold">Admin Portal</h1>
              <p className="text-gray-400 text-sm">Submissions &amp; Leads Overview</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-[#0D1B2A] transition text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 rounded-full border border-gray-600 text-gray-300 hover:border-white hover:text-white transition text-sm font-semibold"
            >
              Back to Site
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Contacts" value={contacts.length} delay={0} />
          <StatCard
            label="Callback Requests"
            value={contacts.filter((c) => c.contact_type === "callback").length}
            delay={0.05}
          />
          <StatCard label="Newsletter Subscribers" value={subscribers.length} delay={0.1} />
          <StatCard label="Onboarding Leads" value={onboarding.length} delay={0.15} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A]"
                  : "border border-gray-600 text-gray-300 hover:border-teal-400 hover:text-white"
              }`}
            >
              {t.label}
              <span className="ml-2 opacity-70">({t.count})</span>
            </button>
          ))}
        </div>

        {/* ── Contacts Table ── */}
        {activeTab === "contacts" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Contact Form Submissions</h2>
            </div>
            {contacts.length === 0 ? (
              <p className="p-12 text-center text-gray-500">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Branch</th>
                      <th className="px-5 py-3">Message</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c, i) => (
                      <tr
                        key={c.id}
                        className={`border-b border-gray-700/40 hover:bg-white/5 transition ${
                          i % 2 === 0 ? "" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-4 font-medium text-white whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            {c.phone && (
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                {c.phone}
                              </div>
                            )}
                            {c.email && (
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                {c.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              c.contact_type === "callback"
                                ? "bg-teal-400/20 text-teal-300"
                                : "bg-green-400/20 text-green-300"
                            }`}
                          >
                            {c.contact_type === "callback" ? "Callback" : "Branch"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-400 whitespace-nowrap">
                          {c.branch ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-300 max-w-xs">
                          <p className="truncate">{c.message || "—"}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDate(c.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Newsletter Table ── */}
        {activeTab === "newsletter" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Newsletter Subscribers</h2>
            </div>
            {subscribers.length === 0 ? (
              <p className="p-12 text-center text-gray-500">No subscribers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Date Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s, i) => (
                      <tr
                        key={s.id}
                        className={`border-b border-gray-700/40 hover:bg-white/5 transition ${
                          i % 2 === 0 ? "" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                        <td className="px-5 py-4 text-white font-medium">{s.email}</td>
                        <td className="px-5 py-4 text-gray-500">{formatDate(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Onboarding Table ── */}
        {activeTab === "onboarding" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Onboarding Submissions</h2>
            </div>
            {onboarding.length === 0 ? (
              <p className="p-12 text-center text-gray-500">No onboarding submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Reg No.</th>
                      <th className="px-5 py-3">VAT</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onboarding.map((o, i) => (
                      <tr
                        key={o.id}
                        className={`border-b border-gray-700/40 hover:bg-white/5 transition ${
                          i % 2 === 0 ? "" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-4 font-medium text-white whitespace-nowrap">
                          {o.name}
                        </td>
                        <td className="px-5 py-4 text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3 flex-shrink-0 text-teal-400" />
                            {o.company ?? "—"}
                          </div>
                          {o.address && (
                            <p className="text-gray-500 text-xs mt-1 max-w-[200px] truncate">
                              {o.address}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-300">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              {o.email}
                            </div>
                            {o.phone && (
                              <div className="flex items-center gap-1.5 text-gray-300">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                {o.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                          {o.reg ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">
                          {o.vat ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDate(o.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Footer note ── */}
        <p className="text-center text-gray-600 text-xs pb-4">
          Premier Mobility Admin Portal · Access restricted
        </p>
      </div>
    </main>
  );
}
