import { PlayType } from "@/types";
import Image from "next/image";
import { FC } from "react";
interface AdminPlayCardProps {
  play: PlayType;
}
const AdminPlayCard: FC<AdminPlayCardProps> = (props) => {
  const { play } = props;
  return (
    <div className="w-full flex gap-2">
      <div className="w-8 h-12">
        <Image src={play.posterImgUrl} fill alt={`${play} image`} />
      </div>
      <div className="flex-1">
        <h1>{play.name}</h1>
        <div className="w-full flex gap-x-3 justify-start flex-wrap items-center ">
          <div>{play.actors.length}</div>
          <div>{play.awards.length}</div>
          <div>{play.numOfViews}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayCard;
