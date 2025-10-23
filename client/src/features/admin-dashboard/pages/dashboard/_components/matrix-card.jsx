import React from "react";

export default function MatrixCard({ className, children }) {
  return (
    <div className={`rounded-md border-2 border-gray-100 bg-white ${className}`}>
      {children}
    </div>
  );
}
