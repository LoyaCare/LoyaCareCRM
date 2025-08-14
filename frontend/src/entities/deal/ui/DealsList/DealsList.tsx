"use client";

import { useEffect } from "react";
import { DealExt } from "@/entities/deal/model/types";
import { useGetDealsQuery } from "@/entities/deal/model/api";
import { formatDate } from "@/shared/lib/formatDate";

export const DealsList = ({
  initialDeals,
}: {
  initialDeals: DealExt[];
}) => {
  const skipFetch = Boolean(initialDeals);
  const { data: deals = initialDeals, isFetching } = useGetDealsQuery(undefined, {
    skip: skipFetch,
  });

  useEffect(() => {
    console.log("Deals uploaded:", deals);
  }, [deals]);

  return (
    <>
      {isFetching && <p>Loading...</p>}
      <ul className="space-y-4">
        {deals?.map((deal) => (
          <li key={deal.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold">
              {deal.stage} - {deal.id}
            </h3>
            <div className="text-sm text-gray-600">
              <p>Creator Name: {deal.creator.name}</p>
              <p>Creator Email: {deal.creator.email}</p>
              <p>Status: {deal.status}</p>
              <p>PotentialValue: {deal.potentialValue}</p>
              <p>Contact name: {deal.contact.name}</p>
              <p>Contact email: {deal.contact.email}</p>
              <p>Contact phone: {deal.contact.phone}</p>
              <ul className="mt-2">
                {deal?.notes?.map((note) => (
                  <li key={note.id} className="text-xs text-gray-500">
                    {note.content} - {formatDate(note.createdAt)}
                  </li>
                ))}
              </ul>
              <p>Created at: {formatDate(deal.createdAt)}</p>
              <p>Updated at: {formatDate(deal.updatedAt)}</p>
              <p>Assigned to: {deal.assignee?.name}</p>
              <p>Contract ID: {deal.contact.id}</p>
              <p>Product Interest: {deal.productInterest}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
