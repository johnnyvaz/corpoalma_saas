import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';
import { getActivityLogs } from '@/lib/db/queries';

// Define the ActivityType as a string literal type
type ActivityType =
  | "sign_up"
  | "sign_in"
  | "sign_out"
  | "update_password"
  | "delete_account"
  | "update_account"
  | "create_team"
  | "remove_team_member"
  | "invite_team_member"
  | "accept_invitation";

const iconMap: Record<ActivityType, LucideIcon> = {
  "sign_up": UserPlus,
  "sign_in": UserCog,
  "sign_out": LogOut,
  "update_password": Lock,
  "delete_account": UserMinus,
  "update_account": Settings,
  "create_team": UserPlus,
  "remove_team_member": UserMinus,
  "invite_team_member": Mail,
  "accept_invitation": CheckCircle,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case "sign_up":
      return 'You signed up';
    case "sign_in":
      return 'You signed in';
    case "sign_out":
      return 'You signed out';
    case "update_password":
      return 'You changed your password';
    case "delete_account":
      return 'You deleted your account';
    case "update_account":
      return 'You updated your account';
    case "create_team":
      return 'You created a new team';
    case "remove_team_member":
      return 'You removed a team member';
    case "invite_team_member":
      return 'You invited a team member';
    case "accept_invitation":
      return 'You accepted an invitation';
    default:
      return 'Unknown action occurred';
  }
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => {
                const Icon = iconMap[log.action as ActivityType] || Settings;
                const formattedAction = formatAction(
                  log.action as ActivityType
                );

                return (
                  <li key={log.id} className="flex items-center space-x-4">
                    <div className="bg-orange-100 rounded-full p-2">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formattedAction}
                        {log.ipAddress && ` from IP ${log.ipAddress}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No activity yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                When you perform actions like signing in or updating your
                account, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}