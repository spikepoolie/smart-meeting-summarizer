import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export default function TopSection({
  allowedTypes,
  handleFileChange,
  message,
  chooseFileMessage,
}) {
  return (
    <>
      <label className="text-sm font-medium text-gray-700">
        {message || "Upload meeting file"}
      </label>

      <div className="relative">
        <input
          type="file"
          accept={allowedTypes.join(",")}
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="inline-flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          {chooseFileMessage || "Choose File"}
        </label>
      </div>
    </>
  );
}
