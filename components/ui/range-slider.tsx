import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    values: [number, number];
    onChange?: (values: [number, number]) => void;
  }
>(({ className, values, onChange, ...props }, ref) => {
  const maxTooltipRef = React.useRef<HTMLDivElement | null>(null);
  const minTooltipRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (minTooltipRef.current) {
      minTooltipRef.current.innerText = values[0].toString();
    }

    // console.log(values[0]);
  }, [values[0]]);

  React.useEffect(() => {
    if (maxTooltipRef.current) {
      maxTooltipRef.current.innerText = values[1].toString();
    }
  }, [values[1]]);
  return (
    <div className={cn("w-full relative flex", className)}>
      <div
        ref={minTooltipRef}
        className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs relative mr-1"
      >
        {values[0]}
      </div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center"
          // className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range
            className="absolute h-full bg-primary"
            style={{
              left: `${(values[0] * 100) / 100}%`,
              right: `${100 - (values[1] * 100) / 100}%`,
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          // Assuming that the values are between 0 and 1
          style={{ left: `${(values[0] * 100) / 100}%` }}
          // Assuming you want to handle drag for the first thumb
          onDrag={(event) => {
            const newValue = (event.pageX / window.innerWidth) * 100;
            if (onChange) {
              onChange([newValue, values[1]]);
            }
          }}
          title={values[0].toString()}
        />

        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          // Assuming that the values are between 0 and 1
          style={{ left: `${(values[1] * 100) / 100}%` }}
          // Assuming you want to handle drag for the second thumb
          onDrag={(event) => {
            const newValue = (event.pageX / window.innerWidth) * 100;

            if (onChange) {
              onChange([values[0], newValue]);
            }
            // setTooltipValue(newValue);
          }}
          title={values[1].toString()}
        />

        {/* Tooltip */}
      </SliderPrimitive.Root>
      <div
        ref={maxTooltipRef}
        className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs relative ml-1"
      >
        {values[1]}
      </div>
    </div>
  );
});

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
