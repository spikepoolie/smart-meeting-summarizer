import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export default function TopSection({
  allowedTypes,
  handleFileChange,
  message,
  chooseFileMessage,
  handleSampleFile,
}) {
  const sampleFile =
    "https://ai-meeting-summary.s3.us-east-1.amazonaws.com/sample-files/SpecialMeeting.mp3";
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

      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-1">Or try a sample file:</p>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => handleSampleFile(sampleFile)}
        >
          ▶️ Use Sample Audio (.mp3)
        </button>
      </div>
    </>
  );
}
