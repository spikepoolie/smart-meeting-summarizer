import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export default function Summary({ summary, downloadPDF }) {
  if (!summary) {
    return null;
  }
  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-700 whitespace-pre-wrap mr-4 flex-1">
          {summary}
        </p>
        <button
          onClick={downloadPDF}
          className="text-purple-600 hover:text-purple-800 mt-1 shrink-0"
          title="Download PDF"
        >
          <i
            className="fa-solid fa-file-pdf text-red-600 text-xl cursor-pointer hover:opacity-80"
            onClick={downloadPDF}
            title="Download PDF"
          />
        </button>
      </div>
    </div>
  );
}
