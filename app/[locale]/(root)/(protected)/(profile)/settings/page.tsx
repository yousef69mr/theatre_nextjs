
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";

import { FC } from "react";

interface SettingsPageProps {
  params: {
    locale: Locale;
  };
}
const SettingsPage: FC<SettingsPageProps> = async (props) => {
  const user = await currentUser();
  return <main className={cn("w-full general-padding")}>{user?.name}</main>;
};

export default SettingsPage;
