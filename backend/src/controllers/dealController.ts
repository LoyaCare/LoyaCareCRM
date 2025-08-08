import { Request, Response } from 'express';
import prisma from "../prisma/client";

const useMock = process.env.USE_MOCK === "true";

export const mockDeals = [
  {
    id: 'deal1',
    contactId: 'contact1',
    creatorId: 'user1',
    productInterest: 'CRM',
    potentialValue: 10000,
    status: 'ACTIVE',
    stage: 'QUALIFIED',
    createdAt: new Date(),
    updatedAt: new Date(),
    contact: { id: 'contact1', clientName: 'John Doe', organization: 'Company A', email: '', phone: '', createdAt: new Date(), updatedAt: new Date() },
    creator: { id: 'user1', name: 'Alice', email: '', password: '', createdAt: new Date(), updatedAt: new Date() }
  }
];

const shouldAllLinkedDatelsIncluded = {
  contact: true,
  creator: true,
  notes: true,
  assignee: true,
};

export const getAllDeals = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockDeals);
  const deals = await prisma.deal.findMany({
    where: { stage: { not: "LEAD" } },
    include: shouldAllLinkedDatelsIncluded,
  });
  res.json(deals);
};

export const getDealById = async (req: Request, res: Response) => {
  if (useMock) {
    const deal = mockDeals.find(d => d.id === req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    return res.json(deal);
  }
  const deal = await prisma.deal.findUnique({
    where: { id: req.params.id },
    include: shouldAllLinkedDatelsIncluded,
  });
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  res.json(deal);
};

export const createDeal = async (req: Request, res: Response) => {
  if (useMock) return res.status(201).json({ ...req.body, id: 'mock-deal' });
  const deal = await prisma.deal.create({ data: req.body });
  res.status(201).json(deal);
};

export const updateDeal = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const deal = await prisma.deal.update({ where: { id: req.params.id }, data: req.body });
  res.json(deal);
};

export const deleteDeal = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.deal.delete({ where: { id: req.params.id } });
  res.status(204).end();
};