'use client';

// This file is used to display a single lead card in the dashboard
// It fetches the lead data by ID and renders the LeadCard component

import React, { useEffect } from "react";
import { LeadCard as LeadCartEntity } from "@/features/lead/ui/LeadCard";

import { useGetLeadByIdQuery } from "@/entities/lead/model/api";
import { LeadExt } from "@/entities/lead/model/types";

type LeadFormProps = {
  initialLeadData: LeadExt;
  onClick?: (leadId: string) => void;
};

export const LeadCard: React.FC<LeadFormProps> = ({ initialLeadData, onClick }) => {
  // Skip the initial fetch if we already have data from SSR
  const skipFetch = Boolean(initialLeadData);

  const {
    data: leadData = initialLeadData,
    isLoading,
    isError,
  } = useGetLeadByIdQuery(initialLeadData.id, {
    skip: skipFetch,
  });

  useEffect(() => {
    console.log("Leads uploaded:", leadData);
  }, [leadData]);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      {isLoading && <p>Loading lead...</p>}
      {isError && <p>Error loading lead.</p>}
      {leadData && (
        <LeadCartEntity initialData={leadData} onOpenLeadForm={onClick} />
      )}
    </div>
  );
};
