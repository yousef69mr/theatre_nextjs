import { FC } from "react";

import { cn } from "@/lib/utils";
import i18nConfig, { Locale } from "@/next-i18next.config";
import { ExecutorType, PlayType } from "@/types";
import { getExecutorByIdRequest } from "@/lib/api-calls/models/executor";

interface SingleExecutorPageProps {
  params: {
    locale: Locale;
    executorId: string;
  };
}

// export async function generateStaticParams() {
//   const plays: PlayType[] = await getAllPlaysRequest();

//   return i18nConfig.locales.map((locale) => {
//     if (plays.length > 0) {
//       return plays.map((play) => ({
//         playId: play.id,
//         locale: locale,
//       }));
//     } else {
//       return { locale: locale, playId: "1" };
//     }
//   });
// }

const SingleExecutorPage: FC<SingleExecutorPageProps> = async (props) => {
  const {
    params: { locale, executorId },
  } = props;

  const executor: ExecutorType | null = await getExecutorByIdRequest(
    executorId
  );

  if (!executor) {
    return <>not found</>;
  }
  return (
    <main className={cn("w-full general-padding")}>
      SingleExecutorPage {executor.name}
    </main>
  );
};

export default SingleExecutorPage;
