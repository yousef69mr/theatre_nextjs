"use client";

import PlaysClientSkeleton from "@/components/skeletons/play/client/public/plays-client-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // console.log("loading...");
  return (
    <div className="flex flex-col w-full main-section general-padding">
      <PlaysClientSkeleton withHeader />
    </div>
  );
}
