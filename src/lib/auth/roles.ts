export const APP_ROLES = ["admin", "member"] as const;
export const USER_STATUSES = ["invited", "active", "suspended"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserProfile {
  id: string;
  role: AppRole;
  status: UserStatus;
  display_name: string | null;
}

export function isAppRole(value: string): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}

export function isUserStatus(value: string): value is UserStatus {
  return USER_STATUSES.includes(value as UserStatus);
}
