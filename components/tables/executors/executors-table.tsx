import { DataTable } from "@/components/ui/data-table";
import { ExecutorType } from "@/types";
import { ExecutorColumns } from "./columns";

interface Props {
  executors: ExecutorType[] ;
}

const ExecutorTable = (props: Props) => {
  const { executors } = props;
  console.log(executors);
  
  return (
    <div className="w-full">
      <DataTable
        data={executors}
        columns={ExecutorColumns}
        initialSearchKey="executorName"
        type="executor"
      />
    </div>
  );
};

export default ExecutorTable;
