import React from "react";

export default function FileInfo({ file }) {
  return (
    <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 border">
      <p>
        <strong>Name:</strong> {file.name}
      </p>
      <p>
        <strong>Type:</strong> {file.type}
      </p>
      <p>
        <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
  );
}
