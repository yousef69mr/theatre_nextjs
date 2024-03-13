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

export interface MultiInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  values: string[];
  onChange: (values: string[]) => void;
}

const MultiInput = React.forwardRef<HTMLInputElement, MultiInputProps>(
  ({ className, type, onChange, values, name, ...props }, ref) => {
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

    const [inputValue, setInputValue] = React.useState<string>("");
    const [valueArray, setValueArray] = React.useState<string[]>(values);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const handleAdd = () => {
      if (inputValue.trim() !== "") {
        const newValues = inputValue.split(",").map((value) => value.trim());
        setValueArray((prevArray) => [...prevArray, ...newValues]);
        setInputValue("");
      }
    };

    React.useEffect(() => {
      onChange && onChange([...valueArray]);
    }, [valueArray]);
    return (
      <div className="w-full space-y-2 ">
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
            name={name}
            value={inputValue}
            onChange={handleChange}
            ref={ref}
            {...props}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={handleAdd}
                className={cn(
                  "absolute top-3 z-10",
                  !["datetime-local"].includes(type || "") &&
                    "rtl:left-3 ltr:right-3",
                  ["datetime-local"].includes(type || "") && "right-3"
                )}
              >
                <PlusCircle className="w-5 h-5 text-emerald-500 hover:bg-transparent" />
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
        </motion.div>
        <div className="w-full flex gap-1 flex-wrap items-center justify-start">
          {valueArray.map((option, index) => (
            <Badge key={index} variant={"secondary"} className="px-4 py-2">
              {isDate(option)
                ? format(new Date(option), "MMMM do, yyyy")
                : isDateTime(option)
                ? format(new Date(option), "MMMM do, yyyy HH:mm")
                : option}{" "}
              <X
                onClick={() =>
                  setValueArray((prev) => [
                    ...prev.filter((temp) => temp !== option),
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
MultiInput.displayName = "MultiInput";

export { MultiInput };
