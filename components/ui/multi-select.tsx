"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/use-break-point";
import { SelectType } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { FormControl } from "./form";
import { Badge } from "./badge";
import { X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: SelectType[];
}

// not implemented yet

const MultiSelect = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, options, placeholder, ...props }, ref) => {
    const radius = 100; // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false);

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const [selectedOptions, setSelectedOptions] = React.useState<SelectType[]>(
      []
    );

    const [open, setOpen] = React.useState(false);
    const { isAboveMd } = useBreakpoint("md");
    // const [selectedStatus, setSelectedStatus] = React.useState<SelectType | null>(
    //   null
    // )

    if (isAboveMd) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
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
                className="p-[2px] rounded-lg transition duration-300 group/input"
              >
                <Button variant="outline" className="w-[150px] justify-start">
                  {selectedOptions ? (
                    <>{selectedOptions.length}</>
                  ) : (
                    <>{placeholder}</>
                  )}
                </Button>
              </motion.div>
            </FormControl>
          </PopoverTrigger>
          <div className="w-full gap-6 items-center justify-start">
            {selectedOptions.map((option) => (
              <Badge>
                {option.label}{" "}
                <X
                  onClick={() =>
                    setSelectedOptions((prev) => [
                      ...prev.filter((temp) => temp.value !== option.value),
                    ])
                  }
                  className="text-destructive w-5 h-5 ltr:ml-2 rtl:mr-2"
                />
              </Badge>
            ))}
          </div>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              options={options}
              setOpen={setOpen}
              setSelectedStatus={(option) =>
                setSelectedOptions([...selectedOptions, option])
              }
            />
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <FormControl>
            <Button variant="outline" className="w-[150px] justify-start">
              {selectedOptions ? (
                <>{selectedOptions.length}</>
              ) : (
                <>{placeholder}</>
              )}
            </Button>
          </FormControl>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList
              options={options}
              setOpen={setOpen}
              setSelectedStatus={(option) =>
                setSelectedOptions([...selectedOptions, option])
              }
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
    return (
      <>
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
          className="p-[2px] rounded-lg transition duration-300 group/input"
        >
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-300",
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
        <motion.div className="flex w-full gap-6 flex-wrap items-center"></motion.div>
      </>
    );
  }
);

function OptionList({
  options,
  setOpen,
  setSelectedStatus,
}: {
  options: SelectType[];
  setOpen: (open: boolean) => void;
  setSelectedStatus: (option: SelectType) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={() => {
                setSelectedStatus(option);
                // setOpen(false);
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
