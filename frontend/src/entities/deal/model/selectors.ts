import { RootState } from '@/shared/lib/store';

export const selectDeals = (state: RootState) => state.dealApi.queries;