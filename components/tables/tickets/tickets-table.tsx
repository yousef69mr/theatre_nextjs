import { DataTable } from "@/components/ui/data-table";
import { TicketType } from "@/types";
import { TicketColumns } from "./columns";

interface Props {
  tickets: TicketType[];
}

const TicketTable = (props: Props) => {
  const { tickets } = props;
  return (
    <div className="w-full">
      <DataTable
        data={tickets}
        columns={TicketColumns}
        initialSearchKey="id"
        type="ticket"
      />
    </div>
  );
};

export default TicketTable;
