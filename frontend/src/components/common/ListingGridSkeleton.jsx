import React from "react";

const ListingGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-green-950/5"
      >
        <div className="h-72 bg-gray-100" />
        <div className="space-y-4 p-6">
          <div className="h-4 w-28 rounded-full bg-gray-100" />
          <div className="h-10 w-3/4 rounded-2xl bg-gray-200" />
          <div className="h-5 w-1/2 rounded-xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-14 rounded-2xl bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

export default ListingGridSkeleton;
