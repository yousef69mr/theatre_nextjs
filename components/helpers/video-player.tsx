import {
  DetailedHTMLProps,
  FC,
  ReactEventHandler,
  VideoHTMLAttributes,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src: string;
  onVideoEnd: () => void;
}
const VideoPlayer: FC<VideoPlayerProps> = (props) => {
  const { src, onVideoEnd } = props;
  // Create a reference to the video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd: ReactEventHandler<HTMLVideoElement> = (event) => {
    // Your custom logic here
    onVideoEnd();
  };
  return (
    <div className="relative w-full h-96">
      <video
        ref={videoRef}
        className="object-cover w-full h-full"
        controls
        onEnded={handleVideoEnd} // Attach event listener for 'ended' event
      >
        <source src={src} type="video/*" />
        Your browser does not support the video tag.
      </video>
      {/* Play button */}
      <Button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full px-4 py-2"
        onClick={() => videoRef.current?.play()}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 3l14 9-14 9V3z" />
        </svg>
      </Button>
    </div>
  );
};

export default VideoPlayer;
