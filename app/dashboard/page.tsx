"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DocumentUpload from "@/components/DocumentUpload";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

const REQUIRED_DOCS = [
  "Directors Identity Document.pdf",
  "Company CK.pdf",
  "VAT Registration.pdf",
  "TTC.pdf",
  "WCM Letter of Good Standing.pdf",
  "BBBEE Certificate.pdf",
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [missingDocs, setMissingDocs] = useState<string[]>([]);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("onboarding")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!error && data) {
      setProfile(data);
      await checkDocuments(user.id);  // pass unique id or email as folder reference
    }
    setLoading(false);
  };

  const checkDocuments = async (userId: string) => {
    const { data, error } = await supabase.storage.from("documents").list(userId);
    if (error) {
      console.error("Error fetching documents", error);
      return;
    }
    const existingDocs = data.map((d) => d.name);
    const missing = REQUIRED_DOCS.filter((doc) => !existingDocs.includes(doc));
    setMissingDocs(missing);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-[#0D1B2A]">
        <p>Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8 space-y-8 lg:grid lg:grid-cols-4 lg:gap-8">
      {/* Sidebar/Profile Info */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="bg-[#132437] rounded-2xl p-6 shadow-lg space-y-4">
          <Image src="/logo.png" alt="Premier Mobility Logo" width={140} height={70} />
          <h2 className="text-xl font-semibold">Welcome, {profile?.name}!</h2>
          <p className="text-gray-400 text-sm">Email: {profile?.email}</p>
          <p className="text-gray-400 text-sm">Phone: {profile?.phone || "Not provided"}</p>
          <p className="text-gray-400 text-sm">Company: {profile?.company}</p>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <section className="lg:col-span-3 space-y-8">
        {/* Onboarding Progress */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-gradient-to-br from-teal-500 to-green-400 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Onboarding Progress</h2>
            <p className="text-lg opacity-90 mb-6">
              Your onboarding process is 75% complete. Upload the remaining required
              documents to get full access to credit features.
            </p>
            <button className="px-6 py-3 rounded-full bg-[#0D1B2A] font-semibold hover:opacity-90 transition">
              Continue
            </button>
          </motion.div>

          <div className="bg-[#132437] rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
            <div className="space-y-2">
              <p className="text-gray-400">Documents Uploaded</p>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-green-400 w-[75%]" />
              </div>
              <p className="text-sm text-gray-500">75% Complete</p>
            </div>
          </div>
        </div>

        {/* Business Services Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-[#132437] rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">Request New Trip Quote</h3>
            <p className="text-gray-400 mb-6">Plan and request quotes for new trips easily.</p>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold">
              Request Quote
            </button>
          </div>
          <div className="bg-[#132437] rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">Lease a Vehicle</h3>
            <p className="text-gray-400 mb-6">Lease a fleet vehicle tailored to your business needs.</p>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold">
              Lease Vehicle
            </button>
          </div>
          <div className="bg-[#132437] rounded-2xl shadow-lg p-6 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">Maintenance & Support</h3>
            <p className="text-gray-400 mb-6">Request maintenance or roadside assistance quickly.</p>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold">
              Request Support
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Document Upload Section */}
        <DocumentUpload />
          {/* Credit Application Section */}
        <section className="bg-[#132437] rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold mb-4">Credit Application</h3>
          {missingDocs.length > 0 ? (
            <>
              <p className="text-gray-400 mb-4">
                You have not yet applied for credit. Please upload the following missing documents:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                {missingDocs.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
              <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:from-green-400 hover:to-teal-400 transition">
                Apply for Credit
              </button>
            </>
          ) : (
            <p className="text-green-400">All required documents uploaded. You can now apply for credit.</p>
          )}
        </section>
          
        </div>

        

        

        {/* Activity */}
        <section className="bg-[#132437] rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Credit Application Submitted</span>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Fleet Request Quotation</span>
              <span className="text-gray-500 text-sm">Yesterday</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-300">Updated Contact Details</span>
              <span className="text-gray-500 text-sm">2 days ago</span>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}
