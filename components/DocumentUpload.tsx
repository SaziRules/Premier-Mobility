"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

export interface DocRecord {
  id: string;
  doc_name: string;
  storage_path: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  uploaded_at: string;
}

export const REQUIRED_DOCS = [
  "Directors Identity Document",
  "Company CK",
  "VAT Registration",
  "TTC",
  "WCM Letter of Good Standing",
  "BBBEE Certificate",
];

export default function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: (records: DocRecord[]) => void }) {
  const [userId, setUserId]     = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [records, setRecords]   = useState<Record<string, DocRecord>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const loadRecords = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", uid);
    if (data) {
      const map: Record<string, DocRecord> = {};
      data.forEach((d: DocRecord) => { map[d.doc_name] = d; });
      setRecords(map);
      onUploadSuccess?.(data);
    }
  }, [onUploadSuccess]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);
      loadRecords(user.id);
    });
  }, [loadRecords]);

  const handleUpload = async (docName: string, file: File) => {
    if (!userId || !userEmail) return;

    const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setErrors(p => ({ ...p, [docName]: "Only PDF, JPEG or PNG allowed." }));
      return;
    }
    if (file.size / 1024 / 1024 > 5) {
      setErrors(p => ({ ...p, [docName]: "File exceeds 5 MB." }));
      return;
    }
    setErrors(p => ({ ...p, [docName]: "" }));
    setUploading(p => ({ ...p, [docName]: true }));

    try {
      const ext = file.name.split(".").pop();
      const storagePath = `${userId}/${docName.replace(/\s+/g, "_")}.${ext}`;

      const { error: storageErr } = await supabase.storage
        .from("documents")
        .upload(storagePath, file, { upsert: true });
      if (storageErr) throw storageErr;

      const { error: dbErr } = await supabase
        .from("documents")
        .upsert(
          {
            user_id:      userId,
            email:        userEmail,
            doc_name:     docName,
            storage_path: storagePath,
            status:       "pending",
            admin_note:   null,
            reviewed_at:  null,
            reviewed_by:  null,
            uploaded_at:  new Date().toISOString(),
          },
          { onConflict: "user_id,doc_name" }
        );
      if (dbErr) throw dbErr;

      await loadRecords(userId);
    } catch (e) {
      setErrors(p => ({ ...p, [docName]: e instanceof Error ? e.message : "Upload failed." }));
    } finally {
      setUploading(p => ({ ...p, [docName]: false }));
    }
  };

  return (
    <section className="bg-[#0D1B2A] text-white p-8 border border-gray-800 rounded-2xl shadow-xl w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Required Documents</h2>
        {userId && (
          <button
            onClick={() => loadRecords(userId)}
            className="text-gray-500 hover:text-teal-400 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {REQUIRED_DOCS.map((doc) => {
          const rec = records[doc];
          const isUploading = uploading[doc];
          const err = errors[doc];

          const borderColor =
            rec?.status === "approved" ? "border-green-500"
            : rec?.status === "rejected" ? "border-red-500"
            : rec ? "border-teal-400"
            : "border-gray-600";

          const Icon =
            rec?.status === "approved" ? CheckCircle
            : rec?.status === "rejected" ? XCircle
            : rec ? Clock
            : UploadCloud;

          const iconColor =
            rec?.status === "approved" ? "text-green-400"
            : rec?.status === "rejected" ? "text-red-400"
            : rec ? "text-teal-400"
            : "text-gray-500";

          const statusLabel =
            rec?.status === "approved" ? "Approved"
            : rec?.status === "rejected" ? "Rejected"
            : rec ? "Pending review"
            : "Not uploaded";

          return (
            <motion.label
              key={doc}
              whileHover={{ scale: 1.02 }}
              className={`relative flex flex-col items-center justify-center min-h-36 border-2 border-dashed ${borderColor} rounded-xl cursor-pointer px-3 py-4 transition hover:border-teal-400 group`}
            >
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && handleUpload(doc, e.target.files[0])}
              />

              {isUploading ? (
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mb-2" />
              ) : (
                <Icon className={`w-8 h-8 ${iconColor} mb-2`} />
              )}

              <span className="text-xs text-center text-gray-300 leading-tight font-medium">{doc}</span>

              <span className={`text-[10px] mt-1 ${
                rec?.status === "approved" ? "text-green-400"
                : rec?.status === "rejected" ? "text-red-400"
                : rec ? "text-teal-400"
                : "text-gray-600"
              }`}>
                {isUploading ? "Uploading…" : statusLabel}
              </span>

              {rec?.status === "rejected" && rec.admin_note && (
                <span className="text-[10px] text-red-300 mt-1 text-center leading-tight px-1">
                  {rec.admin_note}
                </span>
              )}

              {err && (
                <span className="text-[10px] text-red-400 mt-1 text-center leading-tight px-1">{err}</span>
              )}

              {/* Re-upload hint on hover */}
              <span className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition">
                <span className="text-[10px] text-teal-400">Click to {rec ? "re-upload" : "upload"}</span>
              </span>
            </motion.label>
          );
        })}
      </div>
    </section>
  );
}
