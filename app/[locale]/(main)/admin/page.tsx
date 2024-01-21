import { Locale } from "@/next-i18next.config";
import { FC } from "react";

interface AdminPageProps {
  params: { locale: Locale };
}
const AdminPage: FC<AdminPageProps> = () => {
  return <div>AdminPage</div>;
};

export default AdminPage;
