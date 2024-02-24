import { getAllActorsRequest } from "@/lib/api-calls/models/actor";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { FC } from "react";

interface ActorsPageProps {
  params: {
    locale: Locale;
  };
}
const ActorsPage: FC<ActorsPageProps> = async (props) => {
  const actors: ActorType[] = await getAllActorsRequest();
  return (
    <main className={cn("w-full general-padding")}>
      {actors.map((actor) => (
        <div>{actor.name}</div>
      ))}
    </main>
  );
};

export default ActorsPage;
