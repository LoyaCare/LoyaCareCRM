import React, { useState, useEffect } from "react";
import { Lead, LeadExt, CreateLeadDTO, UpdateLeadDTO } from "../model/types";
import {
  useCreateLeadMutation,
  useUpdateLeadMutation,
} from "../model/api";

type LeadFormProps = {
  initialData?: LeadExt;
  onSuccess?: () => void;
};

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSuccess }) => {
  const [form, setForm] = useState<CreateLeadDTO | UpdateLeadDTO>({
    clientName: initialData?.contact?.clientName || "",
    organization: initialData?.contact?.organization || "",
    email: initialData?.contact?.email || "",
    phone: initialData?.contact?.phone || "",
    status: initialData?.status || "ACTIVE",
    // добавьте другие поля по необходимости
  });

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  useEffect(() => {
    if (initialData) {
      setForm({
        clientName: initialData.clientName,
        organization: initialData.organization,
        email: initialData.email,
        phone: initialData.phone,
        status: initialData.status,
        // добавьте другие поля по необходимости
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
      <input
        name="clientName"
        value={form.clientName}
        onChange={handleChange}
        placeholder="Имя клиента"
        className="w-full border rounded px-3 py-2"
        required
      />
      <input
        name="organization"
        value={form.organization}
        onChange={handleChange}
        placeholder="Организация"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Телефон"
        className="w-full border rounded px-3 py-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="NEW">Новый</option>
        <option value="IN_PROGRESS">В работе</option>
        <option value="CLOSED">Закрыт</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isCreating || isUpdating}
      >
        {initialData ? "Сохранить" : "Создать"}
      </button>
    </form>