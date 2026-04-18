"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-user";
import type { AppRole, UserStatus } from "@/lib/auth/roles";
import { inviteUser, updateUserRole, updateUserStatus } from "@/features/users/services/users-service";
import type { InviteUserFormValues } from "@/features/users/services/schemas";

export async function inviteUserAction(values: InviteUserFormValues) {
  await requireRole(["admin"]);
  await inviteUser(values);
  revalidatePath("/users");
}

export async function updateUserRoleAction(userId: string, role: AppRole) {
  await requireRole(["admin"]);
  await updateUserRole(userId, role);
  revalidatePath("/users");
}

export async function updateUserStatusAction(userId: string, status: UserStatus) {
  await requireRole(["admin"]);
  await updateUserStatus(userId, status);
  revalidatePath("/users");
}
