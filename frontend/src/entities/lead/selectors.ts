import { RootState } from '@/shared/lib/store';

export const selectLeads = (state: RootState) => state.leadApi.queries;