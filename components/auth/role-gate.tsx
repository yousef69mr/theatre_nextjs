import FormError from "@/components/forms/form-error";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}
export const RoleGate = async (props: RoleGateProps) => {
  const { children, allowedRole } = props;
  const role = await currentRole();
  if (role !== allowedRole) {
    return (
      <FormError message="You don't have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
