"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const documents = [
  { name: "Directors Identity Document", type: "directors_id" },
  { name: "Company CK", type: "company_ck" },
  { name: "VAT Registration", type: "vat_reg" },
  { name: "TTC", type: "ttc" },
  { name: "WCM Letter of Good Standing", type: "wcm" },
  { name: "BBBEE Certificate", type: "bbbee" },
];

export default function DocumentUpload() {
  const supabase = createClientComponentClient();
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleFileUpload = async (docType: string, file: File) => {
    if (!file) return;

    // Criteria: Only PDF or JPEG and <5MB
    const validTypes = ["application/pdf", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      alert("Only PDF or JPEG files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return;
    }

    try {
      setUploading(docType);

      const filePath = `${docType}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
      const publicUrl = data?.publicUrl || "";

      await supabase.from("documents").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        doc_type: docType,
        url: publicUrl,
      });

      setUploadedFiles((prev) => ({ ...prev, [docType]: publicUrl }));
      alert("Upload successful!");
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setUploading(null);
    }
  };

  return (
    <section className="bg-[#0D1B2A] rounded-xl p-6 shadow-lg border border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">Upload Required Documents</h2>
      <div className="grid grid-cols-3 gap-6">
        {documents.map((doc) => (
          <motion.label
            key={doc.type}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer rounded-lg p-6 flex flex-col items-center justify-center bg-white/5 border border-gray-600 hover:border-teal-400 transition relative"
          >
            {uploading === doc.type ? (
              <span className="text-teal-400 animate-pulse">Uploading...</span>
            ) : uploadedFiles[doc.type] ? (
              <span className="text-green-400">Uploaded</span>
            ) : (
              <>
                <Upload className="w-8 h-8 text-teal-400 mb-2" />
                <p className="text-white text-center text-sm">{doc.name}</p>
                <p className="text-gray-400 text-xs">Click to upload</p>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileUpload(doc.type, e.target.files[0])
              }
            />
          </motion.label>
        ))}
      </div>
    </section>
  );
}
