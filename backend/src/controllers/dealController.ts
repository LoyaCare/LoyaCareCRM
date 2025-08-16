import { Request, Response } from "express";
import prisma from "../prisma/client";
import { Note, Appointment, DealStage } from "../../generated/prisma-client";

export const shouldAllLinkedDatelsIncluded = {
  contact: true,
  creator: true,
  notes: true,
  assignee: true,
  appointments: true,
};

export const getAllLeadsBase = async (
  _req: Request,
  res: Response,
  stage: DealStage = "QUALIFIED"
) => {
  const leads = await prisma.deal.findMany({
    where: { stage },
    include: shouldAllLinkedDatelsIncluded,
  });
  res.json(leads);
};

export const getAllDeals = async (_req: Request, res: Response) =>
  getAllLeadsBase(_req, res);

export const getDealByIdBase = async (id: string) =>
  await prisma.deal.findUnique({
    where: { id },
    include: shouldAllLinkedDatelsIncluded,
  });

export const getDealById = async (req: Request, res: Response) => {
  const deal = await getDealByIdBase(req.params.id);
  if (!deal) return res.status(404).json({ error: "Deal not found" });
  res.json(deal);
};

export const createDealBase = async (
  req: Request,
  res: Response,
  stage: DealStage = "QUALIFIED"
) => {
  const { creator, contact, notes, appointments, assigneeId, ...dealData } =
    req.body;

  const creatorEmail = creator?.email || "hans.schmidt@example.com";
  const deal = await prisma.deal.create({
    data: {
      ...dealData,
      stage,
      creator: creator
        ? {
            connectOrCreate: {
              where: { email: creatorEmail },
              create: creator,
            },
          }
        : { connect: { email: creatorEmail } },

      contact: contact
        ? contact.id
          ? { connnect: contact.id }
          : { create: contact }
        : undefined,

      notes: notes && notes.length > 0 ? { create: notes } : undefined,

      appointments:
        appointments && appointments.length
          ? { create: appointments }
          : undefined,

      assignee: assigneeId
        ? {
            connect: { id: assigneeId },
          }
        : undefined,
    },
    include: shouldAllLinkedDatelsIncluded,
  });

  res.status(201).json(deal);
};

export const createDeal = async (req: Request, res: Response) =>
  await createDealBase(req, res, "QUALIFIED");

export const updateDeal = async (req: Request, res: Response) => {
  const {
    creator,
    assignee,
    assigneeId,
    contact,
    notes = [],
    appointments = [],
    ...dealData
  } = req.body;
  console.log("Updating deal assigneeId:", assigneeId);

  // Split notes into update and create
  const notesToUpdate = notes
    .filter((note: Note) => note.id)
    .map((note: Note) => ({
      ...note,
      creatorId: undefined, // CreatorId is not updated, only the content
      dealId: undefined, // dealId is not uodated, only the content
    }));
  const notesToCreate = notes.filter((note: Note) => !note.id);

  // Split appointments into update and create
  const appointmentsToUpdate = appointments
    .filter((app: Appointment) => app.id && app.dealId !== "REMOVED")
    .map((app: Appointment) => ({
      ...app,
      dealId: undefined, // dealId is not updated, only the content
    }));
  const appointmentsToCreate = appointments.filter(
    (app: Appointment) => !app.id
  )
      .map((app: Appointment) => ({
      ...app,
      dealId: undefined,
    }));


  const appointmentsToDelete = appointments
    .filter(
      (app: Appointment) =>
        app.id && app.dealId && !app.datetime && !app.note && !app.type
    )
    .map((app: Appointment) => ({
      ...app,
      dealId: undefined, // dealId is not updated, only the content
    }));

  // Form a nested object for notes
  const notesNested = {
    update: notesToUpdate.map((note: any) => ({
      where: { id: note.id },
      data: note,
    })),
    create: notesToCreate,
  };

  // Form a nested object for appointments
  const appointmentsNested = {
    update: appointmentsToUpdate.map((app: any) => ({
      where: { id: app.id },
      data: app,
    })),
    create: appointmentsToCreate,
    delete: appointmentsToDelete,
  };

  const deal = await prisma.deal.update({
    where: {
      id: req.params.id,
    },
    data: {
      ...dealData,

      contact: contact?.id
        ? {
            update: {
              where: { id: contact.id },
              data: contact,
            },
          }
        : contact
        ? { create: contact }
        : undefined,

      assignee: assigneeId
        ? {
            connect: { id: assigneeId },
          }
        : undefined,
      
      notes: notes.length > 0 ? notesNested : undefined,
      appointments: appointments.length > 0 ? appointmentsNested : undefined,
    },
    include: shouldAllLinkedDatelsIncluded,
  });

  res.json(deal);
};

export const deleteDeal = async (req: Request, res: Response) => {
  const dealId = req.params.id;
  await prisma.$transaction([
    prisma.note.deleteMany({ where: { dealId } }),
    prisma.appointment.deleteMany({ where: { dealId } }),
    prisma.deal.delete({ where: { id: dealId } }),
  ]);
  res.status(204).end();
};
