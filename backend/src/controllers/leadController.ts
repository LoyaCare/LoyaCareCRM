import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  getDealByIdBase,
  createDealBase,
  deleteDeal,
  updateDeal,
  getAllDealsBase,
  getDealsParamsFromRequest,
  DealsBaseParams,
} from "./dealController";

export const getAllLeads = async (_req: Request, res: Response) => {
  const defaultParams = {
    statuses: ["ACTIVE"],
    stages: ["LEAD"],
  } as DealsBaseParams;

  const params = getDealsParamsFromRequest(_req, defaultParams);
  const deals = await getAllDealsBase(params);

  res.json(deals);
};

export const getLeadById = async (req: Request, res: Response) => {
  const lead = await getDealByIdBase(req.params.id);
  if (!lead || lead.stage !== "LEAD")
    return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
};

export const getArchivedLeads = async (_req: Request, res: Response) => {
  const defaultParams = {
    statuses: ["ARCHIVED"],
    stages: ["LEAD"],
  } as DealsBaseParams;

  const params = getDealsParamsFromRequest(_req, defaultParams);
  const deals = await getAllDealsBase(params);
  res.json(deals);
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
