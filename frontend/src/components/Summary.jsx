import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export default function Summary({ summary, downloadPDF }) {
  if (!summary) {
    return null;
  }
  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200">
      <h2 className="font-semibold text-lg mb-2 text-gray-800">Summary:</h2>
      <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>

      <button
        onClick={downloadPDF}
        className="mt-4 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        <DocumentArrowDownIcon className="w-5 h-5" />
        Download Summary as PDF
      </button>
    </div>
  );
}
