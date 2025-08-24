import { UpdateDealDTO } from "../model";

export const sanitizeDealData = (deal: UpdateDealDTO) => ({
  ...deal,
  creatorId: undefined,
  contactId: undefined,
  assigneeId: undefined,
});
