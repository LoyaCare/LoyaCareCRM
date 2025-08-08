import {
  Prisma,
  Deal,
  DealStage,
  DealStatus,
} from "@/shared/generated/prisma-client";

type DealWithCreatorContact = Prisma.DealGetPayload<{
  include: { creator: true; contact: true };
}>;

type DealExt = Prisma.DealGetPayload<{
  include: { creator: true; contact: true; notes: true; assignee: true };
}>;

export type { Deal, DealWithCreatorContact, DealExt, DealStage, DealStatus };

export type CreateDealDTO = Omit<Deal, "id" | "createdAt" | "updatedAt">;
export type UpdateDealDTO = Partial<CreateDealDTO>;
