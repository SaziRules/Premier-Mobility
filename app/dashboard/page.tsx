"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DocumentUpload, { REQUIRED_DOCS, DocRecord } from "@/components/DocumentUpload";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import {
  CheckCircle, Clock, XCircle, LogOut,
  FileText, Truck, Wrench, AlertCircle,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  reg?: string;
  vat?: string;
}

interface CreditApplication {
  id: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  admin_note: string | null;
  submitted_at: string;
}

interface ActivityItem {
  label: string;
  time: string;
  type: "doc" | "credit";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    pending:      "bg-yellow-400/20 text-yellow-300",
    under_review: "bg-blue-400/20 text-blue-300",
    approved:     "bg-green-400/20 text-green-300",
    rejected:     "bg-red-400/20 text-red-300",
  };
  const labels: Record<string, string> = {
    pending:      "Pending",
    under_review: "Under Review",
    approved:     "Approved",
    rejected:     "Rejected",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] ?? "bg-gray-700 text-gray-300"}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile]       = useState<UserProfile | null>(null);
  const [userId, setUserId]         = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [docRecords, setDocRecords] = useState<DocRecord[]>([]);
  const [application, setApplication] = useState<CreditApplication | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]   = useState("");
  const [activity, setActivity]     = useState<ActivityItem[]>([]);

  const loadApplication = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("credit_applications")
      .select("*")
      .eq("user_id", uid)
      .single();
    if (data) setApplication(data);
    else setApplication(null);
  }, []);

  const buildActivity = useCallback((docs: DocRecord[], app: CreditApplication | null) => {
    const items: ActivityItem[] = [];
    docs.forEach((d) => {
      items.push({
        label: `${d.doc_name} — ${d.status === "approved" ? "Approved" : d.status === "rejected" ? "Rejected" : "Uploaded, pending review"}`,
        time: d.uploaded_at,
        type: "doc",
      });
    });
    if (app) {
      items.push({
        label: `Credit application ${app.status.replace("_", " ")}`,
        time: app.submitted_at,
        type: "credit",
      });
    }
    items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setActivity(items.slice(0, 8));
  }, []);

  const handleDocsLoaded = useCallback((docs: DocRecord[]) => {
    setDocRecords(docs);
    loadApplication(userId ?? "").then((app) => {
      buildActivity(docs, application);
    });
  }, [userId, application, loadApplication, buildActivity]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("onboarding")
        .select("*")
        .eq("email", user.email)
        .single();

      setProfile(profileData ?? null);

      const { data: appData } = await supabase
        .from("credit_applications")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setApplication(appData ?? null);
      setLoading(false);
    };
    init();
  }, [router]);

  // Rebuild activity whenever docs or application change
  useEffect(() => {
    buildActivity(docRecords, application);
  }, [docRecords, application, buildActivity]);

  const handleApplyForCredit = async () => {
    if (!userId || !profile) return;
    setSubmitting(true);
    setSubmitMsg("");

    const { error } = await supabase.from("credit_applications").insert({
      user_id: userId,
      email:   profile.email,
      company: profile.company ?? null,
      status:  "pending",
    });

    if (error) {
      setSubmitMsg(error.message.includes("unique") ? "You already have an active application." : error.message);
    } else {
      const { data } = await supabase
        .from("credit_applications")
        .select("*")
        .eq("user_id", userId)
        .single();
      setApplication(data ?? null);
      setSubmitMsg("Application submitted successfully.");
    }
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-[#0D1B2A]">
        <p className="text-gray-400">Loading your dashboard…</p>
      </main>
    );
  }

  const uploadedCount = docRecords.length;
  const approvedCount = docRecords.filter(d => d.status === "approved").length;
  const progressPercent = Math.round((uploadedCount / REQUIRED_DOCS.length) * 100);
  const allUploaded = uploadedCount === REQUIRED_DOCS.length;

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-6 lg:p-8 flex flex-col gap-8 lg:grid lg:grid-cols-4 lg:gap-8">

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-1 space-y-4">
        <div className="bg-[#132437] rounded-2xl p-6 shadow-lg space-y-4">
          <Image src="/logo.png" alt="Premier Mobility" width={140} height={70} />
          {profile ? (
            <>
              <h2 className="text-xl font-semibold">Welcome, {profile.name}!</h2>
              <div className="space-y-1.5 text-sm text-gray-400">
                <p>{profile.email}</p>
                {profile.phone   && <p>{profile.phone}</p>}
                {profile.company && <p className="font-medium text-white">{profile.company}</p>}
                {profile.address && <p className="text-xs">{profile.address}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>Profile incomplete</p>
              </div>
              <p className="text-gray-500 text-xs">Complete onboarding to unlock all features.</p>
              <a
                href="/#onboarding"
                className="block text-center text-xs px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-bold"
              >
                Start Onboarding
              </a>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <section className="lg:col-span-3 space-y-8">

        {/* ── Progress ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-gradient-to-br from-teal-500 to-green-400 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">Onboarding Progress</h2>
            <p className="opacity-90 mb-6 text-sm">
              {progressPercent < 100
                ? `${uploadedCount} of ${REQUIRED_DOCS.length} documents uploaded (${approvedCount} approved). Upload all required documents to apply for credit.`
                : application
                ? `All documents uploaded. Your credit application is ${application.status.replace("_", " ")}.`
                : "All documents uploaded. You can now apply for credit."}
            </p>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm opacity-80 mt-2">{progressPercent}% complete</p>
          </motion.div>

          <div className="bg-[#132437] rounded-2xl shadow-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Documents</h3>
            {REQUIRED_DOCS.map((name) => {
              const rec = docRecords.find(d => d.doc_name === name);
              return (
                <div key={name} className="flex items-center gap-2 text-xs">
                  {rec?.status === "approved"  ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  : rec?.status === "rejected" ? <XCircle     className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  : rec                        ? <Clock       className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                  :                              <div className="w-3.5 h-3.5 rounded-full border border-gray-600 flex-shrink-0" />}
                  <span className={rec ? "text-gray-300" : "text-gray-600"}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Service quick-actions ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: FileText, title: "Request Trip Quote", desc: "Get a quote for your next logistics move." },
            { icon: Truck,    title: "Lease a Vehicle",    desc: "Flexible fleet leasing for your business." },
            { icon: Wrench,   title: "Maintenance & Support", desc: "Request roadside assistance or servicing." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#132437] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <Icon className="w-6 h-6 text-teal-400 mb-3" />
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
              <button className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold text-sm hover:opacity-90 transition">
                Contact Us
              </button>
            </div>
          ))}
        </div>

        {/* ── Documents + Credit Application ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DocumentUpload onUploadSuccess={handleDocsLoaded} />

          {/* Credit Application */}
          <section className="bg-[#132437] rounded-2xl p-6 shadow-lg flex flex-col">
            <h3 className="text-lg font-semibold mb-1">Credit Application</h3>
            <p className="text-gray-400 text-sm mb-6">
              Upload all {REQUIRED_DOCS.length} required documents, then submit your credit application for review.
            </p>

            {application ? (
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Status:</span>
                  {statusBadge(application.status)}
                </div>
                {application.admin_note && (
                  <div className="bg-[#0D1B2A] rounded-xl p-4 text-sm text-gray-300">
                    <span className="text-gray-500 text-xs block mb-1">Admin note</span>
                    {application.admin_note}
                  </div>
                )}
                {application.status === "rejected" && (
                  <button
                    onClick={async () => {
                      if (!userId || !profile) return;
                      await supabase.from("credit_applications").delete().eq("user_id", userId);
                      setApplication(null);
                      setSubmitMsg("");
                    }}
                    className="text-sm text-teal-400 hover:underline"
                  >
                    Resubmit application
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between">
                {!allUploaded && (
                  <div className="flex items-start gap-2 text-yellow-400 text-sm mb-4">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{REQUIRED_DOCS.length - uploadedCount} document{REQUIRED_DOCS.length - uploadedCount !== 1 ? "s" : ""} still missing.</p>
                  </div>
                )}
                {submitMsg && (
                  <p className="text-sm text-teal-400 mb-4">{submitMsg}</p>
                )}
                <button
                  onClick={handleApplyForCredit}
                  disabled={!allUploaded || submitting || !profile}
                  className="mt-auto px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Apply for Credit"}
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Activity feed ── */}
        <section className="bg-[#132437] rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {activity.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet. Start by uploading your documents.</p>
          ) : (
            <ul className="space-y-3">
              {activity.map((item, i) => (
                <li key={i} className="flex justify-between items-start gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    {item.type === "credit"
                      ? <FileText className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      : <Clock    className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />}
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap">
                    {new Date(item.time).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </section>
    </main>
  );
}
