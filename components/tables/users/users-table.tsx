import { DataTable } from "@/components/ui/data-table";
import { UserType } from "@/types";
import { UserColumns } from "./columns";

interface Props {
  users: UserType[];
}

const UserTable = (props: Props) => {
  const { users } = props;
  return (
    <div className="w-full">
      <DataTable
        data={users}
        columns={UserColumns}
        initialSearchKey="userName"
        type="user"
      />
    </div>
  );
};

export default UserTable;
