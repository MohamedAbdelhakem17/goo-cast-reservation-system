import React from "react";

export default function BookingCardSkelton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-start justify-between">
            <div className="h-8 w-1/2 rounded bg-gray-200" />
            <div className="h-6 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-4">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="h-5 w-2/3 rounded bg-gray-200" />
            <div className="h-5 w-1/2 rounded bg-gray-200" />
            <div className="h-5 w-1/3 rounded bg-gray-200" />
          </div>
          <div className="mt-6">
            <div className="h-10 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
