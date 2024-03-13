import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Header from "@/components/helpers/header";
import Social from "@/components/auth/social";
import BackButton from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerMainLabel?: string | React.ReactNode;
  headerLabel: string | React.ReactNode;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const AuthCardWrapper: React.FC<CardWrapperProps> = (props) => {
  const {
    children,
    headerLabel,
    headerMainLabel,
    backButtonHref,
    backButtonLabel,
    showSocial,
  } = props;

  const title = headerMainLabel || "🔐Auth";
  return (
    <Card className="w-[400px] shadow-md bg-red-100/60 dark:bg-red-700/20 backdrop-saturate-50 backdrop-blur z-40">
      <CardHeader>
        <Header title={title} subtitle={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCardWrapper;
