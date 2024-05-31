"use client";

import CardsListClientSkeleton from "@/components/skeletons/clients/public/cards-list-client-skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  // console.log("loading...");
  return (
    <div className="flex flex-col w-full main-section general-padding">
      <CardsListClientSkeleton withHeader />
    </div>
  );
}
