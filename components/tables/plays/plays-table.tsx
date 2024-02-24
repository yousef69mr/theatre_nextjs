import { DataTable } from "@/components/ui/data-table";
import { PlayType } from "@/types";
import { PlayColumns } from "./columns";

interface Props {
  plays: PlayType[];
}

const PlayTable = (props: Props) => {
  const { plays } = props;
  return (
    <div className="w-full">
      <DataTable
        data={plays}
        columns={PlayColumns}
        initialSearchKey="playName"
        type="play"
      />
    </div>
  );
};

export default PlayTable;
