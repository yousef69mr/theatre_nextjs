import { AlertTriangle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}
const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="justify-between rounded-md p-3 bg-destructive/15 dark:bg-destructive/60 dark:border-red-500 flex items-center gap-x-2 text-sm text-destructive dark:text-red-500">
      <AlertTriangle className="h-5 w-5 self-start" />
      <p className="text-wrap flex-1 ext-sm md:text-xl">{message}</p>
    </div> 
  );
};

export default FormError;
