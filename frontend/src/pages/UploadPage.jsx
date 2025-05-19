import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FileInfo from "../components/FileInfo";
import LoadingOverlay from "../components/LoadingOverlay";
import Popup from "../components/PouPup";
import Summary from "../components/Summary";
import TopSection from "../components/TopSection";
import UploadButton from "../components/UploadButton";
import AiMeetingOrganizer from "../images/ai-meeting-logo.png";

const allowedTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp3",
  "audio/mp4",
  "audio/x-wav",
  "audio/x-m4a",
  "audio/webm",
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
];

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [summary, setSummary] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const appTitle = "AI Meeting Summary Generator";
  const navigate = useNavigate();

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && allowedTypes.includes(selected.type)) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      setPopupMessage("Unsupported file type!");
      setShowPopup(true);
      setFile(null);
      setPreview(null);
    }
  };

  const waitForTranscript = async (
    jobName,
    maxRetries = 12,
    initialDelay = 5000
  ) => {
    const baseUrl = process.env.REACT_APP_API_URL || "";
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await axios.get(
          `${baseUrl}/api/transcribe/result/${jobName}`
        );
        if (res.data?.transcript) {
          return res.data.transcript;
        }
      } catch (err) {
        // Optional: You can log the first error or use error.message if needed
      }
      const backoff = initialDelay * Math.pow(2, attempt); // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
    throw new Error("Transcription job timed out or failed.");
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setSummary("");
    setMessage("Uploading file...");

    try {
      const baseUrl = process.env.REACT_APP_API_URL || "";
      const uploadRes = await axios.post(
        `${baseUrl}/api/transcribe/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const { jobName } = uploadRes.data;
      setMessage(
        "Transcribing audio… please wait.\nIt can take a little while."
      );

      const transcript = await waitForTranscript(jobName);

      setMessage("Generating summary…");

      const sumRes = await axios.post(`${baseUrl}/api/summarize`, {
        transcript,
      });
      setSummary(sumRes.data.summary);
      setMessage("✅ Summary complete!");
    } catch (err) {
      if (err.response) {
        console.error("Upload failed with response:", err.response.data);
        alert(
          `Upload failed: ${err.response.status} ${err.response.statusText}`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Upload failed: No response from server.");
      } else {
        alert("Upload error: " + err.message);
      }
      console.error(err);
      setMessage("❌ An error occurred. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const downloadPDF = () => {
    setUploading(true); // Show overlay
    setMessage("Generating PDF...");

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Meeting Summary", 20, 20);
    doc.text(doc.splitTextToSize(summary, 170), 20, 30);

    doc.save("meeting-summary.pdf"); // ✅ still triggers save prompt
    setUploading(false);
    setTimeout(() => {
      setUploading(false);
      setMessage("");
      setPopupMessage("PDF downloaded successfully!");
      setShowPopup(true); // Show popup
    }, 1000);
  };

  const handleSampleFile = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: blob.type });

      // Create a synthetic event that matches the shape of a real file input event
      const syntheticEvent = {
        target: {
          files: [file],
        },
      };

      handleFileChange(syntheticEvent);
    } catch (err) {
      console.error("Failed to fetch sample file", err);
      setShowPopup(true);
      setMessage("Failed to read sample file");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[640px] bg-white rounded-xl shadow-md p-10 space-y-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 hover:underline text-sm font-medium mb-4"
        >
          ← Back to Intro
        </button>
        {!file && (
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              src={AiMeetingOrganizer}
              alt={appTitle}
              className="w-12 h-12"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {appTitle}
            </h1>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <TopSection
            allowedTypes={allowedTypes}
            handleFileChange={handleFileChange}
            message={"Upload meeting file"}
            chooseFileMessage="Choose File"
            handleSampleFile={handleSampleFile}
          />

          {file && <FileInfo file={file} />}
        </div>

        {preview && (
          <div className="mt-3">
            {file.type.startsWith("audio") ? (
              <audio controls src={preview} className="w-full rounded" />
            ) : (
              <video controls src={preview} className="w-full rounded" />
            )}
          </div>
        )}

        {file && (
          <UploadButton
            handleUpload={handleUpload}
            uploading={uploading}
            message={message}
            processingMessage="Processing..."
            uploadingMessage="Upload & Summarize"
          />
        )}

        {uploading && <LoadingOverlay message={message || "Processing..."} />}

        {showPopup && (
          <Popup
            handleClosePopup={handleClosePopup}
            message={popupMessage}
            btnText="Close"
          />
        )}

        {summary && <Summary summary={summary} downloadPDF={downloadPDF} />}
      </div>
    </div>
  );
}
