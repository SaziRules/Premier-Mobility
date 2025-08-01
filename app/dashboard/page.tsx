"use client";

import { motion } from "framer-motion";
import DocumentUpload from "@/components/DocumentUpload";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white p-8 space-y-8">
      {/* Top row with progress + fleet utilization */}
      <div className="grid gap-6 lg:grid-cols-4">
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

        <div className="bg-[#132437] rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Fleet Utilization</h3>
          <div className="flex justify-between items-end h-32">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={day} className="flex flex-col items-center">
                <div
                  className={`w-6 rounded-t-full ${
                    i === 4 ? "bg-green-400" : "bg-gray-600"
                  }`}
                  style={{ height: `${30 + i * 10}px` }}
                />
                <span className="text-xs text-gray-400 mt-2">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main bottom row: Document Upload + Credit Application */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left - Document Upload */}
        <DocumentUpload />

        {/* Right - Credit Application Summary */}
        <section className="bg-[#132437] rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Credit Application</h3>
          <p className="text-gray-400 mb-6">
            Your credit application is under review. You can upload additional
            supporting documents or update company details if required.
          </p>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Application Status:</span>
              <span className="text-green-400">Pending Review</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Last Updated:</span>
              <span className="text-gray-400">Aug 1, 2025</span>
            </div>
          </div>

          <button className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A] font-semibold hover:from-green-400 hover:to-teal-400 transition">
            Update Application
          </button>
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
    </main>
  );
}
