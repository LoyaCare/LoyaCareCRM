"use client";

import {
  LeadExt,
  CreateLeadDTO,
  UpdateLeadDTO,
} from "@/entities/lead/model/types";
import { useGetLeadByIdQuery } from "@/entities/lead/model/api";
import {
  BaseUpsertForm,
  BaseUpsertFormProps,
} from "@/entities/common/BaseUpsertForm";

type LeadFormProps = BaseUpsertFormProps<
  LeadExt,
  CreateLeadDTO | UpdateLeadDTO
> & {
  leadId?: string;
};

export const LeadUpsertForm: React.FC<LeadFormProps> = ({
  initialData,
  leadId,
  titleCreate = "Create Lead",
  titleUpdate = "Update Lead",
  onSubmit,
}) => {
  const skipFetch = !!initialData || (!initialData && !leadId);

  const {
    data: leadData = initialData,
    isLoading,
    isError,
  } = useGetLeadByIdQuery(leadId || "", {
    skip: skipFetch,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading deal data</div>;
  }

  return (
    <BaseUpsertForm
      initialData={leadData}
      onSubmit={onSubmit}
      titleCreate={titleCreate}
      titleUpdate={titleUpdate}
    />
  );
};
