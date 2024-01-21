import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}
const UserInfo = (props: UserInfoProps) => {
  const { label, user } = props;
  return (
    <Card className="w-full max-w-[600px] shadow-md">
      {label && (
        <CardHeader>
          <p className="text-2xl font-semibold text-center">{label}</p>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {user && (
          <>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">ID</p>
              <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {user.id}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">Name</p>
              <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {user.name}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">Email</p>
              <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {user.email}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">Role</p>
              <p className="truncate text-sm max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
                {user.role}
              </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">Two Factor Authentication</p>
              <Badge
                variant={user.isTwoFactorEnabled ? "success" : "destructive"}
              >
                {user.isTwoFactorEnabled ? "ON" : "OFF"}
              </Badge>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg font-medium border p-3 shadow-sm">
              <p className="text-sm font-medium">Open Authorization</p>
              <Badge variant={user.isOAuth ? "success" : "destructive"}>
                {user.isOAuth ? "YES" : "NO"}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserInfo;
