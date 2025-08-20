import { UpdateDealDTO } from "./types";

export const prepareToUpdate = (deal: UpdateDealDTO) => ({
  ...deal,
  creatorId: undefined,
  contactId: undefined,
  assigneeId: undefined,
});
