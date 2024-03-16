"use client";

import { cn } from "@/lib/utils";
import { FC, HtmlHTMLAttributes } from "react";
// import { Button } from "@/components/ui/button";

interface EmbedVideoPlayerProps extends HtmlHTMLAttributes<HTMLDivElement> {
  src: string;
  type?: "video";

  // onVideoStart: () => void;
}
const EmbedPlayer: FC<EmbedVideoPlayerProps> = (props) => {
  const { src, className } = props;

  // const onVideoStart = () => {};
  return (
    <div className={cn("relative w-full rounded-lg h-96", className)}>
      <iframe
        width="100%"
        height="100%"
        src={src}
        title="YouTube Video Player"
        //  frameBorder="0"
        allowFullScreen
        // onEnded={handleVideoEnd} // Attach event listener for 'ended' event
      />

      {/* Play button */}
      {/* {type === "video" && (
        <Button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full px-4 py-2"
          onClick={onVideoStart}
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
      )} */}
    </div>
  );
};

export default EmbedPlayer;
