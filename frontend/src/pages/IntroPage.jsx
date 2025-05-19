import React from "react";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 text-center">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10 text-center">
        <img
          src="/favicon.png"
          alt="AI Meeting Logo"
          className="w-32 h-32 mb-8 rounded-full border-2 border-gray-300 shadow-md"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to AI Meeting Summary
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          AI Meeting Summary Generator helps you turn long, unstructured meeting
          recordings into clear, concise summaries. It highlights key takeaways,
          action items, and important moments so you can focus on what matters.
        </p>
        <p className="text-md text-gray-600 mb-10 max-w-xl">
          Designed for professionals who want to stay organized, save time, and
          make their meetings actionable.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
