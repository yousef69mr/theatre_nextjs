import { AlertTriangle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}
const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="rounded-md p-3 bg-destructive/15 flex items-center gap-x-2 text-sm text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
