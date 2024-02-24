import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface TableSkeletonProps {
  cols: number;
  rows: number;
}

const GenerateTableCols: FC<{ cols: number }> = ({ cols }) => {
  // Calculate the column template based on the number of columns
  const columnTemplate = `repeat(${cols}, 1fr)`;

  // Style for the grid container
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: columnTemplate,
    gap: "1rem", // Adjust gap as needed
  };

  // Generate div elements for each column
  const columns = Array.from({ length: cols }, (_, index) => (
    <Skeleton key={index} className={`h-12`} />
  ));
  return <div style={gridStyle}>{columns}</div>;
};

const GenerateTableRows: FC<{ rows: number }> = ({ rows }) => {
  const rowItems = [];

  // Generate div elements for each column
  for (let i = 0; i < rows; i++) {
    rowItems.push(<Skeleton className="h-10 w-full" />);
  }

  return (
    <>
      {rowItems.map((item, index) => (
        <div key={index} className="flex">
          {item}
        </div>
      ))}
    </>
  );
};
const TableSkeleton: FC<TableSkeletonProps> = (props) => {
  const { cols, rows } = props;
  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="flex w-full h-10 justify-between items-center">
        <div className="flex gap-x-2 items-center justify-center">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="w-full">
        <GenerateTableCols cols={cols} />
      </div>
      <div className="space-y-2">
        <GenerateTableRows rows={rows} />
      </div>
      <div className="gap-x-2 flex items-center justify-end">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  );
};
export default TableSkeleton;
