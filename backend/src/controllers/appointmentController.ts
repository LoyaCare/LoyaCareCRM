import prisma from "../prisma/client";
import { Request, Response } from "express";

const useMock = process.env.USE_MOCK === "true";

const mockAppointments = [
  {
    id: "appt1",
    datetime: new Date(),
    type: "call",
    notes: "Erster Anruf",
    dealId: "deal1",
  },
  {
    id: "appt2",
    datetime: new Date(),
    type: "meeting",
    notes: "Treffen mit dem Kunden",
    dealId: "deal1",
  },
];

export const getAllAppointments = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockAppointments);
  const appointments = await prisma.appointment.findMany({
    include: {
      deal: true,
    },
  });
  res.json(appointments);
};

export const getAppointmentById = async (req: Request, res: Response) => {
  if (useMock) {
    const appointment = mockAppointments.find((a) => a.id === req.params.id);
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
    return res.json(appointment);
  }
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { deal: true },
  });
  if (!appointment)
    return res.status(404).json({ error: "Appointment not found" });
  res.json(appointment);
};

export const createAppointment = async (req: Request, res: Response) => {
  if (useMock)
    return res.status(201).json({ ...req.body, id: "mock-appointment" });
  const appointment = await prisma.appointment.create({ data: req.body });
  res.status(201).json(appointment);
};

export const updateAppointment = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const appointment = await prisma.appointment.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(appointment);
};

export const deleteAppointment = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.appointment.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
