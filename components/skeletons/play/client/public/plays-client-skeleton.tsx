import { Skeleton } from "@/components/ui/skeleton";
import { CARDS_PER_PAGE } from "@/lib/constants";
import { FC } from "react";

interface PlaysClientSkeletonProps {
  withHeader?: boolean;
  cardsPerPage?: number;
}

const PlaysClientSkeleton: FC<PlaysClientSkeletonProps> = (props) => {
  const { withHeader = false, cardsPerPage = CARDS_PER_PAGE } = props;

  const navButtons = 3;
  return (
    <div className="w-full space-y-2">
      {Boolean(withHeader) && (
        <div className="w-full flex items-center justify-between">
          <Skeleton className="w-40 h-10" />
          <Skeleton className="w-20 h-10" />
        </div>
      )}
      <div className="w-full gap-6 mt-2  grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: cardsPerPage }).map((_, index) => (
          <Skeleton key={index} className="w-full h-80" />
        ))}
      </div>
      <div className="w-full flex justify-center items-center gap-x-2">
        <Skeleton className="w-20 h-10" />
        {Array.from({ length: navButtons }).map((_, index) => (
          <Skeleton key={index} className="w-10 h-10" />
        ))}
        <Skeleton className="w-20 h-10" />
      </div>
    </div>
  );
};

export default PlaysClientSkeleton;
