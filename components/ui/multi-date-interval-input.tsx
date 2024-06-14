import * as React from "react";

import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { Badge } from "./badge";
import { PlusCircle, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { useTranslation } from "react-i18next";
import { isDate, isDateTime } from "@/lib/helpers/time-parser";
import { format } from "date-fns";
import { TimeIntervalType } from "@/types";
import { Separator } from "./separator";
import { Button } from "./button";

export interface MultiDateIntervalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  values: TimeIntervalType[];
  startName: string;
  endName: string;
  onChange: (values: TimeIntervalType[]) => void;
}

const MultiDateIntervalInput = React.forwardRef<
  HTMLInputElement,
  MultiDateIntervalInputProps
>(
  (
    { className, type, onChange, values, startName, endName, name, ...props },
    ref
  ) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);
    const { t } = useTranslation();

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const [startValue, setStartValue] = React.useState<string>("");
    const [endValue, setEndValue] = React.useState<string>("");
    const [valueArray, setValueArray] =
      React.useState<TimeIntervalType[]>(values);

    const handleStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartValue(event.target.value);
    };

    const handleEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndValue(event.target.value);
    };

    const handleAdd = () => {
      if (startValue.trim() !== "") {
        //   const newValues = inputValue.split(",").map((value) => value.trim());
        const newValue = { startDate: startValue, endDate: endValue };
        setValueArray((prevArray) => [...prevArray, newValue]);
        setStartValue("");
        setEndValue("");
      }
    };

    React.useEffect(() => {
      onChange && onChange([...valueArray]);
    }, [valueArray]);
    return (
      <div className="w-full space-y-2 ">
        <div className="flex gap-2 relative">
          <motion.div
            style={{
              background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--blue-500),
        transparent 80%
      )
    `,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="p-[2px] rounded-lg transition duration-300 group/input w-full relative"
          >
            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-300",
                className
              )}
              name={startName}
              value={startValue}
              onChange={handleStartChange}
              ref={ref}
              {...props}
            />
          </motion.div>
          <motion.div
            style={{
              background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--blue-500),
        transparent 80%
      )
    `,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            className="p-[2px] rounded-lg transition duration-300 group/input w-full relative"
          >
            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-300",
                className
              )}
              name={endName}
              value={endValue}
              onChange={handleEndChange}
              ref={ref}
              {...props}
            />
          </motion.div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                asChild
                // className={cn(
                //   " top-3 z-10",
                //   !["datetime-local"].includes(type || "") &&
                //     "rtl:left-3 ltr:right-3",
                //   ["datetime-local"].includes(type || "") && "right-3"
                // )}
              >
                <Button type="button" variant={"outline"} onClick={handleAdd}>
                  <PlusCircle className="w-5 h-5 text-emerald-500 hover:bg-transparent" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {t("actions.add", {
                    ns: "common",
                    instance: t(`forms.labels.${name}`, {
                      ns: "constants",
                    }),
                  })}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-full flex gap-1 flex-wrap items-center justify-start">
          {valueArray.map((option, index) => (
            <Badge key={index} variant={"secondary"} className="px-4 py-2">
              {isDate(option.startDate)
                ? format(new Date(option.startDate), "MMMM do, yyyy")
                : isDateTime(option.startDate)
                ? format(new Date(option.startDate), "MMMM do, yyyy HH:mm")
                : option.startDate}{" "}
              <Separator className="mx-2 w-5" />
              {option.endDate
                ? isDate(option.endDate)
                  ? format(new Date(option.endDate), "MMMM do, yyyy")
                  : isDateTime(option.endDate)
                  ? format(new Date(option.endDate), "MMMM do, yyyy HH:mm")
                  : option.endDate
                : t("time.present", { ns: "common" })}
              <X
                onClick={() =>
                  setValueArray((prev) => [
                    ...prev.filter(
                      (temp) => temp.startDate !== option.startDate
                    ),
                  ])
                }
                className="text-destructive w-5 h-5 ltr:ml-2 rtl:mr-2 cursor-pointer"
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  }
);
MultiDateIntervalInput.displayName = "MultiDateIntervalInput";

export { MultiDateIntervalInput };
