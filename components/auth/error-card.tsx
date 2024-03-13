import AuthCardWrapper from "@/components/cards/auth-card-wrapper";
import { AlertTriangle } from "lucide-react";

const ErrorCard = () => {
  return (
    <AuthCardWrapper
      headerLabel="Oops! Something went wrong!"
      headerMainLabel="🔐 Auth"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full justify-center items-center">
        <AlertTriangle className="text-destructive h-5 w-5" />
      </div>
    </AuthCardWrapper>
  );
};

export default ErrorCard;
