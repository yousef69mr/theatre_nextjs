import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { PlayType } from "@/types";
import { Eye, Trophy } from "lucide-react";
import { FC } from "react";
interface PlayCardProps {
  play: PlayType;
}
const PlayCard: FC<PlayCardProps> = (props) => {
  const { play } = props;
  return (
    <DirectionAwareHover
      className="w-44 h-60 md:w-60 md:h-80"
      imageUrl={play.posterImgUrl}
    >
      <div className="flex flex-col items-center justify-center space-y-2 w-full">
        <h3 className="text-md md:text-xl font-medium truncate">{play.name}</h3>
        <div className="flex flex-wrap gap-1 text-xs font-medium">
          <div className="flex items-center justify-center">
            <Eye className="rtl:ml-2 ltr:mr-2 w-4 h-4" />
            {play.numOfViews}
          </div>
          <div className="flex items-center justify-center">
            <Trophy className="rtl:ml-2 ltr:mr-2 w-4 h-4" />
            {play.awards.length}
          </div>
        </div>
      </div>
    </DirectionAwareHover>
  );
};

export default PlayCard;
