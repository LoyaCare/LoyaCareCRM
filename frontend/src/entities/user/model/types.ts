import {
  Prisma,
  User as PrismaUser,
  UserRole,
  UserStatus,
} from "@/shared/generated/prisma-client";

export { UserRole, UserStatus } from "@/shared/generated/prisma-client";

// Базовый тип пользователя
export type User = PrismaUser;

// Расширенный тип пользователя с дополнительными полями
export interface UserExt extends User {
  createdByUser?: User | null;
}

// DTO для создания пользователя
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status?: UserStatus;
  createdById?: string;
}

// DTO для обновления пользователя
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string | null;
  role?: UserRole;
  status?: UserStatus;
}

// Тип для ответа с пользователями
export type UsersResponse = UserExt[];
