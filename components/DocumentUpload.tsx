"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, XCircle } from "lucide-react";

interface UploadStatus {
  [key: string]: "idle" | "uploading" | "success" | "error";
}

const requiredDocuments = [
  "Directors Identity Document",
  "Company CK",
  "VAT Registration",
  "TTC",
  "WCM Letter of Good Standing",
  "BBBEE Certificate",
];

export default function DocumentUpload() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});

  const validateFile = (file: File) => {
    const maxSizeMB = 5; // Average size limit
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) return "Only PDF, JPEG, JPG, PNG allowed.";
    if (file.size / 1024 / 1024 > maxSizeMB) return "File size exceeds 5MB.";
    return null;
  };

  const handleUpload = async (docName: string, file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadStatus((prev) => ({ ...prev, [docName]: "error" }));
      alert(validationError);
      return;
    }

    try {
      setUploadStatus((prev) => ({ ...prev, [docName]: "uploading" }));

      // Ensure bucket exists
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("documents");
      if (!bucketData && bucketError) {
        const { error: createError } = await supabase.storage.createBucket("documents", {
          public: false,
          fileSizeLimit: 5242880,
        });
        if (createError) throw createError;
      }

      const filePath = `${docName.replace(/\s+/g, "_")}/${file.name}`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file, {
        upsert: true,
      });

      if (uploadError) throw uploadError;

      setUploadStatus((prev) => ({ ...prev, [docName]: "success" }));
    } catch (err: any) {
      console.error("Upload error:", err.message);
      setUploadStatus((prev) => ({ ...prev, [docName]: "error" }));
      alert(`Failed to upload ${docName}: ${err.message}`);
    }
  };

  return (
    <section className="bg-[#0D1B2A] text-white p-8 border border-gray-800 rounded-xl shadow-xl w-full">
      <h2 className="text-2xl font-bold mb-6">Upload Required Documents</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {requiredDocuments.map((doc) => (
          <motion.label
            key={doc}
            whileHover={{ scale: 1.03 }}
            className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer hover:border-teal-400 px-4 transition relative"
          >
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(doc, e.target.files[0])}
            />
            {uploadStatus[doc] === "success" ? (
              <CheckCircle className="w-10 h-10 text-green-400 mb-2" />
            ) : uploadStatus[doc] === "error" ? (
              <XCircle className="w-10 h-10 text-red-400 mb-2" />
            ) : (
              <UploadCloud className="w-10 h-10 text-teal-400 mb-2" />
            )}
            <span className="text-sm text-center">{doc}</span>
            {uploadStatus[doc] === "uploading" && (
              <span className="absolute bottom-2 text-xs text-teal-300 animate-pulse">Uploading...</span>
            )}
          </motion.label>
        ))}
      </div>
    </section>
  );
}
