import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "./header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string | React.ReactNode;
  headerSubTitle: string | React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = (props) => {
  const { children, headerTitle, headerSubTitle } = props;

  return (
    <Card className="w-full max-w-[95%] md:max-w-[500px] mx-auto shadow-md bg-red-100/60 dark:bg-red-900/40 backdrop-saturate-50">
      <CardHeader>
        <Header title={headerTitle} subtitle={headerSubTitle} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
