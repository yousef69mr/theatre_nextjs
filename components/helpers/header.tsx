import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
}

const Header = (props: HeaderProps) => {
  const { title, subtitle } = props;
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      {typeof title === "string" ? (
        <h1 className={cn("text-3xl font-semibold")}>{title}</h1>
      ) : (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          {title}
        </div>
      )}
      {typeof subtitle === "string" ? (
        <p className="dark:text-red-100 text-red-700  text-lg font-medium">
          {subtitle}
        </p>
      ) : (
        <div className="dark:text-red-100 text-red-700  text-lg font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default Header;
