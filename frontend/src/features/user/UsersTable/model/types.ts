import { BaseTableRowData } from "@/features/BaseTable";
import { UserRole, UserStatus } from "@/entities/user";

export interface UserTableRowData extends BaseTableRowData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}