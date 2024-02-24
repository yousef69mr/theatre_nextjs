import { PlayType } from "@/types";
import { FC } from "react";
import PlayCard from "./play-card";
interface PlayListProps {
  plays: PlayType[];
}
const PlayList: FC<PlayListProps> = (props) => {
  const { plays } = props;
  return (
    <section className="w-full flex flex-col">
      {/**TODO: filter plays */}
      <div></div>
      <div className="w-full flex-1 gap-2">
        {plays.map((play) => (
          <PlayCard key={play.id} play={play} />
        ))}
      </div>
    </section>
  );
};

export default PlayList;
