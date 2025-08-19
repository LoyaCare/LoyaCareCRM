import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  getDealByIdBase,
  createDealBase,
  deleteDeal,
  updateDeal,
  getAllLeadsBase,
} from "./dealController";

export const getAllLeads = async (_req: Request, res: Response) =>
  await getAllLeadsBase(_req, res, ["LEAD"]);

export const getLeadById = async (req: Request, res: Response) => {
  const lead = await getDealByIdBase(req.params.id);
  if (!lead || lead.stage !== "LEAD")
    return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
};

export const createLead = async (req: Request, res: Response) =>
   createDealBase(req, res, "LEAD");

export const updateLead = async (req: Request, res: Response) => await updateDeal(req, res);

export const deleteLead = async (req: Request, res: Response) =>
  await deleteDeal(req, res);

export const convertLeadToDeal = async (req: Request, res: Response) => {
  const lead = await prisma.deal.update({
    where: { id: req.params.id },
    data: { stage: "QUALIFIED" },
  });
  res.json(lead);
};
