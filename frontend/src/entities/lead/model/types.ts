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

export type {
  Deal as Lead,
  DealWithCreatorContact,
  DealExt as LeadExt,
  DealStage as LeadStage,
  DealStatus as LeadStatus,
};

export type CreateLeadDTO = Omit<Deal, "id" | "createdAt" | "updatedAt">;
export type UpdateLeadDTO = Partial<CreateLeadDTO>;
