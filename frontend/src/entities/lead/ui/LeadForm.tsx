import React, { useState, useEffect } from "react";
import { LeadExt, CreateLeadDTO, UpdateLeadDTO } from "@/features/lead/model/types";
import {
  useCreateLeadMutation,
  useUpdateLeadMutation,
} from "../../../features/lead/model/api";

type LeadFormProps = {
  initialData?: LeadExt;
  onSuccess?: () => void;
};

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState<CreateLeadDTO | UpdateLeadDTO>({
    stage: initialData?.stage || "LEAD",
    status: initialData?.status || "ACTIVE",
    productInterest: initialData?.productInterest,
    potentialValue: initialData?.potentialValue,

    contact: initialData?.contact,
    notes: initialData?.notes,
    appointments: initialData?.appointments,
  });

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  useEffect(() => {
    if (initialData) {
      setForm({
        stage: initialData?.stage || "LEAD",
        status: initialData?.status || "ACTIVE",
        productInterest: initialData?.productInterest,
        potentialValue: initialData?.potentialValue,

        contact: initialData?.contact,
        notes: initialData?.notes,
        appointments: initialData?.appointments,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await updateLead({ id: initialData.id, body: form as UpdateLeadDTO });
    } else {
      await createLead(form as CreateLeadDTO);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* <input
        name="clientName"
        value={form.contact?.name}
        onChange={handleChange}
        placeholder="Имя клиента"
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        name="organization"
        value={form.contact?.organization || ""}
        onChange={handleChange}
        placeholder="Организация"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="email"
        value={form.contact?.email || "" }
        onChange={handleChange}
        placeholder="Email"
        type="email"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="phone"
        value={form.contact?.phone || ""}
        onChange={handleChange}
        placeholder="Телефон"
        className="w-full border rounded px-3 py-2"
      /> */}
      <input
        name="productInterest"
        value={form.productInterest || ""}
        onChange={handleChange}
        placeholder="productInterest"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="potentialValue"
        value={form.potentialValue || ""}
        onChange={handleChange}
        placeholder="Wert"
        className="w-full border rounded px-3 py-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="ACTIVE">Active</option>
        <option value="ARCHIVED">Archivedd</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isCreating || isUpdating}
      >
        {initialData ? "Save" : "Create"}
      </button>
    </form>
  );}