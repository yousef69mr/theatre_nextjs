import BounceLoader from "react-spinners/BounceLoader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <BounceLoader className="text-primary" size={96} />;
}
