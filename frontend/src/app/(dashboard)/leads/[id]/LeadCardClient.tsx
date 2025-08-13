"use client";

import { LeadCard } from "@/entities/lead/ui/LeadCard";
import { useGetLeadByIdQuery } from "@/features/lead/model/api";
import { LeadExt } from "@/features/lead/model/types";

type Props = {
  id: string;
  initialLeadData: LeadExt | null;
};

export default function LeadCardClient({ id, initialLeadData }: Props) {
  // If SSR already provided data, skip the first request
  const skipFetch = Boolean(initialLeadData);

  const { data, isLoading, isError } = useGetLeadByIdQuery(id, {
    skip: skipFetch,
  });

  // Use either data from RTK Query or from SSR
  const lead = data ?? initialLeadData;

  if (isLoading && !lead) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading data</p>;
  if (!lead) return <p>No data</p>;

  return <LeadCard initialLeadData={lead} />;
}