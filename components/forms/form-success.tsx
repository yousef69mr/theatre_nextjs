import { CheckCircle } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}
const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="rounded-md p-3 bg-emerald-500/15 flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
