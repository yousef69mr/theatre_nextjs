"use client";

import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-screen flex items-center justify-center main-section">
      <ClimbingBoxLoader
        size={30}
        color="red"
        loading={true}
        speedMultiplier={2}
      />
    </div>
  );
}
