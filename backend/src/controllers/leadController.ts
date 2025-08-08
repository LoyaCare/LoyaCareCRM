import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { mockDeals } from './dealController';

const useMock = process.env.USE_MOCK === 'true';

const mockLeads = mockDeals.filter(d => d.stage === 'LEAD');

const shouldAllLinkedDtealsIncluded = {
  contact: true,
  creator: true,
  notes: true,
  assignee: true,
};

export const getAllLeads = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockLeads);
  
  const leads = await prisma.deal.findMany({
    where: { stage: "LEAD" },
    include: shouldAllLinkedDtealsIncluded,
  });
  res.json(leads);
};

export const getLeadById = async (req: Request, res: Response) => {
  if (useMock) {
    const lead = mockLeads.find(d => d.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    return res.json(lead);
  }
  const lead = await prisma.deal.findUnique({
    where: { id: req.params.id },
    include: shouldAllLinkedDtealsIncluded,
  });
  if (!lead || lead.stage !== 'LEAD') return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
};

export const createLead = async (req: Request, res: Response) => {
  if (useMock) return res.status(201).json({ ...req.body, id: 'mock-lead', stage: 'LEAD' });
  const lead = await prisma.deal.create({ data: { ...req.body, stage: 'LEAD' } });
  res.status(201).json(lead);
};

export const updateLead = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const lead = await prisma.deal.update({ where: { id: req.params.id }, data: req.body });
  res.json(lead);
};

export const deleteLead = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.deal.delete({ where: { id: req.params.id } });
  res.status(204).end();
};

export const convertLeadToDeal = async (req: Request, res: Response) => {
  if (useMock) return res.json({ id: req.params.id, stage: 'QUALIFIED' });
  const lead = await prisma.deal.update({ where: { id: req.params.id }, data: { stage: 'QUALIFIED' } });
  res.json(lead);
};
