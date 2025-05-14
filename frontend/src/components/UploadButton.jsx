import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export default function UploadButton({
  handleUpload,
  uploading,
  message,
  processingMessage,
  uploadingMessage,
}) {
  return (
    <button
      onClick={handleUpload}
      disabled={uploading}
      className={`w-full flex items-center justify-center gap-2 py-2 rounded transition text-white
              ${
                message.includes("error") || message.includes("❌")
                  ? "bg-red-600 hover:bg-red-700"
                  : message.includes("Summary complete")
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
    >
      <ArrowUpTrayIcon className="w-5 h-5" />
      {uploading ? message || processingMessage : uploadingMessage}
    </button>
  );
}
