"use client";

import ExecutorsClientSkeleton from "@/components/skeletons/executor/client/public/executors-client-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // console.log("loading...");
  return (
    <div className="flex flex-col w-full main-section general-padding">
      <ExecutorsClientSkeleton withHeader />
    </div>
  );
}
