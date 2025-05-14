import React from "react";

export default function LoadingOverlay({ message = "Processing..." }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
        <p className="text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
}
