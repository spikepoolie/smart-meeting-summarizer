import React from "react";

export default function Popup({ handleClosePopup, message, btnText }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white px-6 py-4 rounded-xl shadow-xl text-center w-[90vw] max-w-sm">
        <p className="text-gray-800 font-semibold text-base mb-3">{message}</p>
        <button
          onClick={handleClosePopup}
          className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}
