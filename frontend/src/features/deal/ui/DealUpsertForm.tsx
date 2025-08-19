"use client";

import {
  DealExt,
  CreateDealDTO,
  UpdateDealDTO,
} from "@/entities/deal/model/types";
import { useGetDealByIdQuery } from "@/entities/deal/model/api";
import {
  BaseUpsertForm,
  BaseUpsertFormProps,
} from "@/entities/common/BaseUpsertForm";

type DealFormProps = BaseUpsertFormProps<
  DealExt,
  CreateDealDTO | UpdateDealDTO
> & {
  dealId?: string;
};

export const DealUpsertForm: React.FC<DealFormProps> = ({
  initialData,
  dealId,
  titleCreate = "Create Deal",
  titleUpdate = "Update Deal",
  onSubmit,
}) => {
  const skipFetch = !!initialData || (!initialData && !dealId);

  const {
    data: dealData = initialData,
    isLoading,
    isError,
  } = useGetDealByIdQuery(dealId || "", {
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
      initialData={dealData}
      onSubmit={onSubmit}
      titleCreate={titleCreate}
      titleUpdate={titleUpdate}
      isDeal={true}
    />
  );
};
