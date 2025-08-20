import {
  Prisma,
  User,
} from "@/shared/generated/prisma-client";


type UserExt = Prisma.UserGetPayload<{
  include: { notes: true; };
}>;

export type { User, UserExt };

export type CreateUserDTO = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUserDTO = Partial<CreateUserDTO>;
