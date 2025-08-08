'use client';

import { useEffect } from "react";
import { formatDate } from "@/shared/lib/formatDate";
import { LeadExt } from "../../model/types";
import { useGetLeadsQuery } from "../../model/api";

export const LeadsList = ({ initialLeads }: { initialLeads: LeadExt[] }) => {

  const { data: leads = initialLeads, isFetching } = useGetLeadsQuery();

  useEffect(() => {
    console.log("Leads uploaded:", leads);
  }, [leads]);

  return (
    <>
      {isFetching && <p>Loading...</p>}
      <ul className="space-y-4">
        {leads?.map((lead) => (
          <li key={lead.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold">{lead.stage} - {lead.id}</h3>
            <div className="text-sm text-gray-600">
              <p>Creator Name: {lead.creator.name}</p>
              <p>Creator Email: {lead.creator.email}</p>
              <p>Status: {lead.status}</p>
              <p>PotentialValue: {lead.potentialValue}</p>
              <p>Contact name: {lead.contact.clientName}</p>
              <p>Contact email: {lead.contact.email}</p>
              <p>Contact phone: {lead.contact.phone}</p>
              <ul className="mt-2">
                {lead?.notes?.map((note) => (
                  <li key={note.id} className="text-xs text-gray-500">
                    {note.content} - {formatDate(note.createdAt)}
                  </li>
                ))}
              </ul>
              <p>Created at: {formatDate(lead.createdAt)}</p>
              <p>Updated at: {formatDate(lead.updatedAt)}</p>
              <p>Assigned to: {lead.assignee?.name}</p>
              <p>Contract ID: {lead.contact.id}</p>
              <p>Product Interest: {lead.productInterest}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
