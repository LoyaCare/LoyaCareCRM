import { Request, Response } from "express";
import prisma from "../prisma/client";

const useMock = process.env.USE_MOCK === "true";
const mockContacts = [
  {
    id: "contact1",
    clientName: "John Doe",
    organization: "Company A",
    email: "john@example.com",
    phone: "123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllContacts = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockContacts);
  const contacts = await prisma.contact.findMany({
    include: { deals: true },
  });
  res.json(contacts);
};

export const getContactById = async (req: Request, res: Response) => {
  if (useMock) {
    const contact = mockContacts.find((c) => c.id === req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    return res.json(contact);
  }
  const contact = await prisma.contact.findUnique({
    where: { id: req.params.id },
    include: { deals: true },
  });
  if (!contact) return res.status(404).json({ error: "Contact not found" });
  res.json(contact);
};

export const createContact = async (req: Request, res: Response) => {
  if (useMock) return res.status(201).json({ ...req.body, id: "mock-contact" });
  const contact = await prisma.contact.create({ data: req.body });
  res.status(201).json(contact);
};

export const updateContact = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const contact = await prisma.contact.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(contact);
};

export const deleteContact = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.contact.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
