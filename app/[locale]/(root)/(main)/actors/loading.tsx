"use client";

import ActorsClientSkeleton from "@/components/skeletons/actor/client/public/actors-client-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
//   console.log("loading...");
  return (
    <div className="flex flex-col w-full main-section general-padding">
      <ActorsClientSkeleton  withHeader/>
    </div>
  );
}
