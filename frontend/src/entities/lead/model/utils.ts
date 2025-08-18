import { UpdateLeadDTO } from "./types";

export const prepareToUpdate = (deal: UpdateLeadDTO) => ({
  ...deal,
  creatorId: undefined,
  contactId: undefined,
  assigneeId: undefined,
});
