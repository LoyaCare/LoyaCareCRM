import { UserExt } from "@/entities/user";
import { UserTableRowData } from "../model/types";
import { formatDate } from "@/shared/lib/";

export function mapUsersToUserRows(users: UserExt[]): UserTableRowData[] {
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: formatDate(user.createdAt) as string,
  }));
}