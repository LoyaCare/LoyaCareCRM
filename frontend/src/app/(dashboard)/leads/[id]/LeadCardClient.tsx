"use client";

import { LeadCard } from "@/entities/lead/ui/LeadCard";
import { useGetLeadByIdQuery } from "@/entities/lead/api";
import { LeadExt } from "@/entities/lead/types";

type Props = {
  id: string;
  initialLeadData: LeadExt | null;
};

export default function LeadCardClient({ id, initialLeadData }: Props) {
  // If SSR already provided data, skip the first request
  const skipFetch = Boolean(initialLeadData);

  const {
    data = initialLeadData,
    isLoading,
    isError,
  } = useGetLeadByIdQuery(id, {
    skip: skipFetch,
  });

  // Use either data from RTK Query or from SSR
  const lead = data;

  if (isLoading && !lead) return <p>Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading data</p>;
  if (!lead) return <p>No data</p>;

  return <LeadCard initialLeadData={lead} />;
}