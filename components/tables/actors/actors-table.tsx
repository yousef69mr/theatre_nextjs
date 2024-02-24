import { DataTable } from "@/components/ui/data-table";
import { ActorType } from "@/types";
import { ActorColumns } from "./columns";

interface Props {
  actors: ActorType[];
}

const ActorTable = (props: Props) => {
  const { actors } = props;
  return (
    <div className="w-full">
      <DataTable
        data={actors}
        columns={ActorColumns}
        initialSearchKey="actorName"
        type="actor"
      />
    </div>
  );
};

export default ActorTable;
