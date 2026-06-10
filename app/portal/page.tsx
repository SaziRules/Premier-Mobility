"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import {
  Users, UserPlus, LogOut, RefreshCw, X,
  Eye, EyeOff, Mail, User, Lock,
  Phone, MessageSquare, Building2, FileText,
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  MapPin, ArrowRight, Calendar, Package,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Contact     { id: string; name: string; phone?: string; email?: string; message?: string; contact_type?: string; branch?: string; created_at: string; }
interface Subscriber  { id: string; email: string; created_at: string; }
interface Onboarding  { id: string; name: string; email: string; phone?: string; company?: string; address?: string; reg?: string; vat?: string; created_at: string; }
interface DocRecord   { id: string; user_id: string; email: string; doc_name: string; storage_path: string; status: "pending"|"approved"|"rejected"; admin_note: string|null; uploaded_at: string; reviewed_at: string|null; reviewed_by: string|null; }
interface Application { id: string; user_id: string; email: string; company: string|null; status: "pending"|"under_review"|"approved"|"rejected"; admin_note: string|null; submitted_at: string; reviewed_at: string|null; reviewed_by: string|null; }
interface QuoteRequest { id: string; user_id: string|null; name: string; email: string; phone: string|null; origin: string|null; destination: string; pickup_date: string; cargo_type: string; cargo_notes: string|null; status: "new"|"reviewing"|"quoted"|"closed"; admin_note: string|null; submitted_at: string; reviewed_at: string|null; reviewed_by: string|null; }
interface PortalAdmin { id: string; email: string; name: string|null; created_by: string|null; created_at: string; }

type Tab = "contacts"|"newsletter"|"onboarding"|"documents"|"applications"|"quotes"|"users";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day:"2-digit", month:"short", year:"numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string,string> = {
    pending:      "bg-yellow-400/20 text-yellow-300",
    under_review: "bg-blue-400/20 text-blue-300",
    approved:     "bg-green-400/20 text-green-300",
    rejected:     "bg-red-400/20 text-red-300",
  };
  const labels: Record<string,string> = {
    pending:"Pending", under_review:"Under Review", approved:"Approved", rejected:"Rejected",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? "bg-gray-700 text-gray-300"}`}>
      {labels[status] ?? status}
    </span>
  );
}

function StatCard({ label, value, delay=0 }: { label:string; value:number; delay?:number }) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay}} className="bg-[#132437] rounded-2xl p-5 space-y-1">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-3xl font-bold animated-gradient-text">{value}</p>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PortalPage() {
  const router = useRouter();
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab]   = useState<Tab>("contacts");

  const [contacts, setContacts]         = useState<Contact[]>([]);
  const [subscribers, setSubscribers]   = useState<Subscriber[]>([]);
  const [onboarding, setOnboarding]     = useState<Onboarding[]>([]);
  const [documents, setDocuments]       = useState<DocRecord[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [quotes, setQuotes]             = useState<QuoteRequest[]>([]);
  const [admins, setAdmins]             = useState<PortalAdmin[]>([]);
  const [quotingId, setQuotingId]       = useState<string|null>(null);
  const [quoteNote, setQuoteNote]       = useState("");

  // Document review state
  const [rejectingDoc, setRejectingDoc]     = useState<string|null>(null);
  const [rejectDocNote, setRejectDocNote]   = useState("");
  const [expandedClient, setExpandedClient] = useState<string|null>(null);

  // Application review state
  const [rejectingApp, setRejectingApp]   = useState<string|null>(null);
  const [rejectAppNote, setRejectAppNote] = useState("");

  // Create user modal
  const [showModal, setShowModal]       = useState(false);
  const [newEmail, setNewEmail]         = useState("");
  const [newName, setNewName]           = useState("");
  const [newPassword, setNewPassword]   = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [creating, setCreating]         = useState(false);
  const [createError, setCreateError]   = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const loadData = useCallback(async () => {
    const [cR,nR,oR,dR,aR,qR,uR] = await Promise.all([
      supabase.from("contacts").select("*").order("created_at",{ascending:false}),
      supabase.from("newsletter").select("*").order("created_at",{ascending:false}),
      supabase.from("onboarding").select("*").order("created_at",{ascending:false}),
      supabase.from("documents").select("*").order("uploaded_at",{ascending:false}),
      supabase.from("credit_applications").select("*").order("submitted_at",{ascending:false}),
      supabase.from("quote_requests").select("*").order("submitted_at",{ascending:false}),
      supabase.from("portal_admins").select("*").order("created_at",{ascending:false}),
    ]);
    if (cR.data) setContacts(cR.data);
    if (nR.data) setSubscribers(nR.data);
    if (oR.data) setOnboarding(oR.data);
    if (dR.data) setDocuments(dR.data);
    if (aR.data) setApplications(aR.data);
    if (qR.data) setQuotes(qR.data);
    if (uR.data) setAdmins(uR.data);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: adminCheck } = await supabase
        .from("portal_admins").select("email").eq("email", user.email).single();
      if (!adminCheck) { router.push("/"); return; }

      setCurrentAdminEmail(user.email ?? "");
      setAuthorized(true);
      await loadData();
      setLoading(false);
    };
    init();
  }, [router, loadData]);

  const handleRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };
  const handleSignOut = async () => { await supabase.auth.signOut(); router.push("/login"); };

  // ── Document actions ──────────────────────────────────────────────────────
  const approveDoc = async (docId: string) => {
    await supabase.from("documents").update({
      status: "approved", admin_note: null,
      reviewed_by: currentAdminEmail, reviewed_at: new Date().toISOString(),
    }).eq("id", docId);
    await loadData();
  };

  const rejectDoc = async (docId: string) => {
    await supabase.from("documents").update({
      status: "rejected", admin_note: rejectDocNote || null,
      reviewed_by: currentAdminEmail, reviewed_at: new Date().toISOString(),
    }).eq("id", docId);
    setRejectingDoc(null);
    setRejectDocNote("");
    await loadData();
  };

  // ── Quote actions ─────────────────────────────────────────────────────────
  const updateQuote = async (quoteId: string, status: QuoteRequest["status"], note?: string) => {
    await supabase.from("quote_requests").update({
      status, admin_note: note || null,
      reviewed_by: currentAdminEmail, reviewed_at: new Date().toISOString(),
    }).eq("id", quoteId);
    setQuotingId(null);
    setQuoteNote("");
    await loadData();
  };

  // ── Application actions ───────────────────────────────────────────────────
  const updateApp = async (appId: string, status: Application["status"], note?: string) => {
    await supabase.from("credit_applications").update({
      status, admin_note: note || null,
      reviewed_by: currentAdminEmail, reviewed_at: new Date().toISOString(),
    }).eq("id", appId);
    setRejectingApp(null);
    setRejectAppNote("");
    await loadData();
  };

  // ── Create user ───────────────────────────────────────────────────────────
  const openModal = () => {
    setNewEmail(""); setNewName(""); setNewPassword("");
    setCreateError(""); setCreateSuccess(""); setShowModal(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(""); setCreateSuccess(""); setCreating(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setCreateError("Session expired."); setCreating(false); return; }

    const res = await fetch("/api/portal/create-user", {
      method: "POST",
      headers: { "Content-Type":"application/json", Authorization:`Bearer ${session.access_token}` },
      body: JSON.stringify({ email: newEmail, name: newName, password: newPassword }),
    });
    const json = await res.json();
    if (!res.ok) setCreateError(json.error ?? "Failed to create user.");
    else { setCreateSuccess(`${newEmail} added as a portal admin.`); await loadData(); }
    setCreating(false);
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D1B2A] text-white">
      <p className="text-gray-400">Loading portal…</p>
    </main>
  );
  if (!authorized) return null;

  // Group documents by client email
  const docsByEmail: Record<string, DocRecord[]> = {};
  documents.forEach(d => { (docsByEmail[d.email] ??= []).push(d); });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "contacts",     label: "Contacts",     count: contacts.length },
    { key: "newsletter",   label: "Newsletter",   count: subscribers.length },
    { key: "onboarding",   label: "Onboarding",   count: onboarding.length },
    { key: "documents",    label: "Documents",    count: documents.length },
    { key: "applications", label: "Applications", count: applications.length },
    { key: "quotes",       label: "Quotes",       count: quotes.length },
    { key: "users",        label: "Users",        count: admins.length },
  ];

  const pendingDocs    = documents.filter(d => d.status === "pending").length;
  const pendingApps    = applications.filter(a => a.status === "pending" || a.status === "under_review").length;
  const newQuotes      = quotes.filter(q => q.status === "new" || q.status === "reviewing").length;

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Premier Mobility" width={120} height={60} />
            <div>
              <h1 className="text-2xl font-bold">Admin Portal</h1>
              <p className="text-gray-400 text-sm">Submissions · Documents · Applications · Users</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-[#0D1B2A] transition text-sm font-semibold disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${refreshing?"animate-spin":""}`} /> Refresh
            </button>
            <button onClick={openModal}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold text-sm">
              <UserPlus className="w-4 h-4" /> Create User
            </button>
            <button onClick={() => router.push("/")}
              className="px-5 py-2 rounded-full border border-gray-600 text-gray-300 hover:border-white hover:text-white transition text-sm font-semibold">
              Back to Site
            </button>
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 transition text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          <StatCard label="Contacts"      value={contacts.length}     delay={0}    />
          <StatCard label="Subscribers"   value={subscribers.length}  delay={0.04} />
          <StatCard label="Onboarded"     value={onboarding.length}   delay={0.08} />
          <StatCard label="Docs Pending"  value={pendingDocs}         delay={0.12} />
          <StatCard label="Apps Pending"  value={pendingApps}         delay={0.16} />
          <StatCard label="New Quotes"    value={newQuotes}           delay={0.20} />
          <StatCard label="Portal Users"  value={admins.length}       delay={0.24} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === t.key
                  ? "bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A]"
                  : "border border-gray-600 text-gray-300 hover:border-teal-400 hover:text-white"
              }`}>
              {t.label}
              {(t.key === "documents" && pendingDocs > 0)    ? <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-400 text-[#0D1B2A] text-[10px] font-bold">{pendingDocs}</span>
              : (t.key === "applications" && pendingApps > 0) ? <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-400 text-[#0D1B2A] text-[10px] font-bold">{pendingApps}</span>
              : (t.key === "quotes" && newQuotes > 0)         ? <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-yellow-400 text-[#0D1B2A] text-[10px] font-bold">{newQuotes}</span>
              : <span className="ml-2 opacity-50">({t.count})</span>}
            </button>
          ))}
        </div>

        {/* ══ CONTACTS ══ */}
        {activeTab === "contacts" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Contact Form Submissions</h2>
            </div>
            {contacts.length === 0 ? <p className="p-12 text-center text-gray-500">No submissions yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">Name</th><th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Type</th><th className="px-5 py-3">Branch</th>
                    <th className="px-5 py-3">Message</th><th className="px-5 py-3">Date</th>
                  </tr></thead>
                  <tbody>
                    {contacts.map((c,i) => (
                      <tr key={c.id} className={`border-b border-gray-700/40 hover:bg-white/5 transition ${i%2===0?"":"bg-white/[0.02]"}`}>
                        <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{c.name}</td>
                        <td className="px-5 py-4"><div className="space-y-1">
                          {c.phone && <div className="flex items-center gap-1.5 text-gray-300"><Phone className="w-3 h-3" />{c.phone}</div>}
                          {c.email && <div className="flex items-center gap-1.5 text-gray-300"><Mail  className="w-3 h-3" />{c.email}</div>}
                        </div></td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.contact_type==="callback"?"bg-teal-400/20 text-teal-300":"bg-green-400/20 text-green-300"}`}>
                            {c.contact_type==="callback"?"Callback":"Branch"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{c.branch??"—"}</td>
                        <td className="px-5 py-4 text-gray-300 max-w-xs"><p className="truncate">{c.message||"—"}</p></td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ NEWSLETTER ══ */}
        {activeTab === "newsletter" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Newsletter Subscribers</h2>
            </div>
            {subscribers.length === 0 ? <p className="p-12 text-center text-gray-500">No subscribers yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">#</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Date Subscribed</th>
                  </tr></thead>
                  <tbody>
                    {subscribers.map((s,i) => (
                      <tr key={s.id} className={`border-b border-gray-700/40 hover:bg-white/5 transition ${i%2===0?"":"bg-white/[0.02]"}`}>
                        <td className="px-5 py-4 text-gray-500">{i+1}</td>
                        <td className="px-5 py-4 text-white font-medium">{s.email}</td>
                        <td className="px-5 py-4 text-gray-500">{fmt(s.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ ONBOARDING ══ */}
        {activeTab === "onboarding" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Onboarding Submissions</h2>
            </div>
            {onboarding.length === 0 ? <p className="p-12 text-center text-gray-500">No submissions yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">Name</th><th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Contact</th><th className="px-5 py-3">Reg No.</th>
                    <th className="px-5 py-3">VAT</th><th className="px-5 py-3">Date</th>
                  </tr></thead>
                  <tbody>
                    {onboarding.map((o,i) => (
                      <tr key={o.id} className={`border-b border-gray-700/40 hover:bg-white/5 transition ${i%2===0?"":"bg-white/[0.02]"}`}>
                        <td className="px-5 py-4 font-medium text-white whitespace-nowrap">{o.name}</td>
                        <td className="px-5 py-4 text-gray-300">
                          <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-teal-400 flex-shrink-0" />{o.company??"—"}</div>
                          {o.address && <p className="text-gray-500 text-xs mt-1 max-w-[200px] truncate">{o.address}</p>}
                        </td>
                        <td className="px-5 py-4"><div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-300"><Mail  className="w-3 h-3" />{o.email}</div>
                          {o.phone && <div className="flex items-center gap-1.5 text-gray-300"><Phone className="w-3 h-3" />{o.phone}</div>}
                        </div></td>
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">{o.reg??"—"}</td>
                        <td className="px-5 py-4 text-gray-400 font-mono text-xs">{o.vat??"—"}</td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(o.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ DOCUMENTS ══ */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="bg-[#132437] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <h2 className="font-semibold">Client Documents</h2>
                {pendingDocs > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-semibold">{pendingDocs} pending review</span>}
              </div>

              {Object.keys(docsByEmail).length === 0 ? (
                <p className="p-12 text-center text-gray-500">No documents uploaded yet.</p>
              ) : (
                <div className="divide-y divide-gray-700/40">
                  {Object.entries(docsByEmail).map(([email, docs]) => {
                    const clientProfile = onboarding.find(o => o.email === email);
                    const isExpanded = expandedClient === email;
                    const clientPending = docs.filter(d => d.status === "pending").length;

                    return (
                      <div key={email}>
                        {/* Client header row */}
                        <button
                          onClick={() => setExpandedClient(isExpanded ? null : email)}
                          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-[#0D1B2A] font-bold text-sm flex-shrink-0">
                              {(clientProfile?.name ?? email)[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">{clientProfile?.name ?? email}</p>
                              <p className="text-gray-500 text-xs">{email} {clientProfile?.company ? `· ${clientProfile.company}` : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">{docs.filter(d=>d.status==="approved").length}/{docs.length} approved</span>
                            {clientPending > 0 && <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs">{clientPending} pending</span>}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                          </div>
                        </button>

                        {/* Expanded document rows */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 space-y-2 bg-[#0D1B2A]/40">
                                {docs.map(doc => (
                                  <div key={doc.id} className="flex items-center justify-between gap-4 py-2 border-b border-gray-700/30 last:border-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                      {doc.status === "approved" ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                      : doc.status === "rejected" ? <XCircle   className="w-4 h-4 text-red-400 flex-shrink-0" />
                                      : <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                                      <div className="min-w-0">
                                        <p className="text-sm text-gray-200 truncate">{doc.doc_name}</p>
                                        {doc.admin_note && <p className="text-xs text-gray-500 truncate">{doc.admin_note}</p>}
                                        <p className="text-xs text-gray-600">{fmt(doc.uploaded_at)}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <StatusBadge status={doc.status} />

                                      {doc.status !== "approved" && (
                                        <button onClick={() => approveDoc(doc.id)}
                                          className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 hover:bg-green-400/30 text-xs font-semibold transition">
                                          Approve
                                        </button>
                                      )}

                                      {doc.status !== "rejected" && rejectingDoc !== doc.id && (
                                        <button onClick={() => { setRejectingDoc(doc.id); setRejectDocNote(""); }}
                                          className="px-3 py-1 rounded-full bg-red-400/20 text-red-300 hover:bg-red-400/30 text-xs font-semibold transition">
                                          Reject
                                        </button>
                                      )}

                                      {rejectingDoc === doc.id && (
                                        <div className="flex items-center gap-2">
                                          <input
                                            autoFocus
                                            value={rejectDocNote}
                                            onChange={e => setRejectDocNote(e.target.value)}
                                            placeholder="Reason (optional)"
                                            className="bg-[#0D1B2A] border border-gray-600 rounded-lg px-3 py-1 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-400 w-40"
                                          />
                                          <button onClick={() => rejectDoc(doc.id)} className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">Confirm</button>
                                          <button onClick={() => setRejectingDoc(null)} className="px-2 py-1 rounded-full border border-gray-600 text-gray-400 text-xs">Cancel</button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ APPLICATIONS ══ */}
        {activeTab === "applications" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Credit Applications</h2>
              {pendingApps > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-semibold">{pendingApps} need attention</span>}
            </div>

            {applications.length === 0 ? (
              <p className="p-12 text-center text-gray-500">No credit applications yet.</p>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {applications.map(app => {
                  const clientProfile = onboarding.find(o => o.email === app.email);
                  const clientDocs    = documents.filter(d => d.email === app.email);
                  const approvedDocs  = clientDocs.filter(d => d.status === "approved").length;

                  return (
                    <div key={app.id} className="px-6 py-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{clientProfile?.name ?? app.email}</p>
                            <StatusBadge status={app.status} />
                          </div>
                          <p className="text-gray-400 text-sm">{app.email}</p>
                          {app.company && <p className="text-gray-500 text-xs">{app.company}</p>}
                          <p className="text-gray-600 text-xs">
                            Submitted {fmt(app.submitted_at)} · {approvedDocs} of {clientDocs.length} docs approved
                          </p>
                          {app.admin_note && (
                            <p className="text-sm text-gray-300 bg-[#0D1B2A] rounded-lg px-3 py-2 mt-2">{app.admin_note}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                          {app.status !== "under_review" && (
                            <button onClick={() => updateApp(app.id, "under_review")}
                              className="px-3 py-1.5 rounded-full bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 text-xs font-semibold transition">
                              Mark Under Review
                            </button>
                          )}
                          {app.status !== "approved" && (
                            <button onClick={() => updateApp(app.id, "approved")}
                              className="px-3 py-1.5 rounded-full bg-green-400/20 text-green-300 hover:bg-green-400/30 text-xs font-semibold transition">
                              Approve
                            </button>
                          )}
                          {app.status !== "rejected" && rejectingApp !== app.id && (
                            <button onClick={() => { setRejectingApp(app.id); setRejectAppNote(""); }}
                              className="px-3 py-1.5 rounded-full bg-red-400/20 text-red-300 hover:bg-red-400/30 text-xs font-semibold transition">
                              Reject
                            </button>
                          )}
                          {rejectingApp === app.id && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                autoFocus
                                value={rejectAppNote}
                                onChange={e => setRejectAppNote(e.target.value)}
                                placeholder="Reason (optional)"
                                className="bg-[#0D1B2A] border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-400 w-48"
                              />
                              <button onClick={() => updateApp(app.id, "rejected", rejectAppNote)} className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold">Confirm</button>
                              <button onClick={() => setRejectingApp(null)} className="px-3 py-1.5 rounded-full border border-gray-600 text-gray-400 text-xs">Cancel</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ QUOTES ══ */}
        {activeTab === "quotes" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-400" />
              <h2 className="font-semibold">Quote Requests</h2>
              {newQuotes > 0 && <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-semibold">{newQuotes} need attention</span>}
            </div>

            {quotes.length === 0 ? (
              <p className="p-12 text-center text-gray-500">No quote requests yet.</p>
            ) : (
              <div className="divide-y divide-gray-700/40">
                {quotes.map(q => (
                  <div key={q.id} className="px-6 py-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-white">{q.name}</p>
                          <StatusBadge status={q.status} />
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                          <Mail className="w-3 h-3 flex-shrink-0" />{q.email}
                          {q.phone && <><span className="text-gray-600">·</span><Phone className="w-3 h-3 flex-shrink-0" />{q.phone}</>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                          <span>{q.origin ? `${q.origin}` : "—"}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                          <span className="font-medium text-white">{q.destination}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-teal-400" />{new Date(q.pickup_date).toLocaleDateString("en-ZA", {day:"2-digit",month:"short",year:"numeric"})}</span>
                          <span className="flex items-center gap-1"><Package className="w-3 h-3 text-teal-400" />{q.cargo_type}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Submitted {fmt(q.submitted_at)}</span>
                        </div>
                        {q.cargo_notes && (
                          <p className="text-xs text-gray-400 bg-[#0D1B2A] rounded-lg px-3 py-2 mt-1">{q.cargo_notes}</p>
                        )}
                        {q.admin_note && (
                          <div className="bg-teal-400/10 border border-teal-400/20 rounded-lg px-3 py-2 mt-1">
                            <p className="text-xs text-gray-500 mb-0.5">Quote response</p>
                            <p className="text-sm text-teal-300">{q.admin_note}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-start gap-2 flex-shrink-0">
                        {q.status === "new" && (
                          <button onClick={() => updateQuote(q.id, "reviewing")}
                            className="px-3 py-1.5 rounded-full bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 text-xs font-semibold transition">
                            Mark Reviewing
                          </button>
                        )}
                        {q.status !== "closed" && quotingId !== q.id && (
                          <button onClick={() => { setQuotingId(q.id); setQuoteNote(q.admin_note ?? ""); }}
                            className="px-3 py-1.5 rounded-full bg-teal-400/20 text-teal-300 hover:bg-teal-400/30 text-xs font-semibold transition">
                            {q.status === "quoted" ? "Edit Quote" : "Send Quote"}
                          </button>
                        )}
                        {q.status !== "closed" && (
                          <button onClick={() => updateQuote(q.id, "closed")}
                            className="px-3 py-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-700 text-xs font-semibold transition">
                            Close
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quote response input */}
                    {quotingId === q.id && (
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="overflow-hidden">
                        <div className="bg-[#0D1B2A] rounded-xl p-4 space-y-3">
                          <p className="text-xs text-gray-400">Quote response / pricing (visible to client)</p>
                          <textarea
                            autoFocus
                            value={quoteNote}
                            onChange={e => setQuoteNote(e.target.value)}
                            placeholder="e.g. Based on your route and cargo, our rate for this trip is R12,500. Transit time: 2 days. Contact us to confirm booking."
                            rows={3}
                            className="w-full bg-[#132437] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 resize-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => updateQuote(q.id, "quoted", quoteNote)}
                              className="px-4 py-1.5 rounded-full bg-teal-500 text-white text-xs font-semibold hover:bg-teal-400 transition">
                              Send Quote
                            </button>
                            <button onClick={() => setQuotingId(null)}
                              className="px-4 py-1.5 rounded-full border border-gray-600 text-gray-400 text-xs">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ USERS ══ */}
        {activeTab === "users" && (
          <div className="bg-[#132437] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h2 className="font-semibold">Portal Admins</h2>
              </div>
              <button onClick={openModal}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold text-xs hover:opacity-90 transition">
                <UserPlus className="w-3.5 h-3.5" /> Add User
              </button>
            </div>
            {admins.length === 0 ? <p className="p-12 text-center text-gray-500">No admins yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-700 text-gray-400 text-left text-xs uppercase tracking-wider">
                    <th className="px-5 py-3">#</th><th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Email</th><th className="px-5 py-3">Added By</th><th className="px-5 py-3">Date</th>
                  </tr></thead>
                  <tbody>
                    {admins.map((a,i) => (
                      <tr key={a.id} className={`border-b border-gray-700/40 hover:bg-white/5 transition ${i%2===0?"":"bg-white/[0.02]"}`}>
                        <td className="px-5 py-4 text-gray-500">{i+1}</td>
                        <td className="px-5 py-4 font-medium text-white">{a.name??"—"}</td>
                        <td className="px-5 py-4 text-gray-300">{a.email}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{a.created_by??"—"}</td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(a.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-gray-600 text-xs pb-4">Premier Mobility Admin Portal · Access restricted</p>
      </div>

      {/* ── Create User Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}}
              className="w-full max-w-md bg-[#132437] rounded-2xl p-8 space-y-6 shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                <X className="w-4 h-4 text-white" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Create Portal Admin</h2>
                <p className="text-gray-400 text-sm mt-1">Creates a Supabase account and grants portal access immediately.</p>
              </div>
              {createSuccess ? (
                <div className="space-y-4">
                  <p className="text-teal-400 text-sm bg-teal-400/10 border border-teal-400/20 rounded-xl px-4 py-3">{createSuccess}</p>
                  <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-bold text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Jane Smith"
                        className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="email" required value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="admin@example.com"
                        className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-400">Password</label>
                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type={showPw?"text":"password"} required value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Min. 8 characters"
                        className="w-full bg-[#0D1B2A] border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-teal-400 transition text-sm" />
                      <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPw?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  {createError && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">{createError}</p>}
                  <button type="submit" disabled={creating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-bold hover:opacity-90 transition disabled:opacity-50 text-sm">
                    {creating?"Creating…":"Create User"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
