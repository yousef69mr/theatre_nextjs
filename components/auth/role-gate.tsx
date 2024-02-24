import FormError from "@/components/forms/form-error";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}
export const RoleGate = async (props: RoleGateProps) => {
  const { children, allowedRoles } = props;
  const role = await currentRole();
  if (!allowedRoles.includes(role as UserRole)) {
    return (
      <main className="w-full flex items-center justify-center min-">
      <FormError message="You don't have permission to view this content!" />
      </main>
    );
  }

  return <>{children}</>;
};
