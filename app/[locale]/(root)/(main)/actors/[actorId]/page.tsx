import { getActorByIdRequest } from "@/lib/api-calls/models/actor";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { ActorType } from "@/types";
import { FC } from "react";

interface SingleActorPageProps {
  params: {
    locale: Locale;
    actorId: string;
  };
}
const SingleActorPage: FC<SingleActorPageProps> = async (props) => {
  const {
    params: { actorId, locale },
  } = props;
  const actor: ActorType = await getActorByIdRequest(actorId);
  return (
    <main className={cn("w-full general-padding")}></main>
  )
};

export default SingleActorPage;
