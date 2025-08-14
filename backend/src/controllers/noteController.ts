import { Request, Response } from "express";
import prisma from "../prisma/client";

const useMock = process.env.USE_MOCK === "true";

const mockNotes = [
  {
    id: "note1",
    creatorId: "user1",
    content: "Первое примечание",
    createdAt: new Date(),
    updatedAt: new Date(),
    dealId: "deal1",
  },
  {
    id: "note2",
    creatorId: "user2",
    content: "Второе примечание",
    createdAt: new Date(),
    updatedAt: new Date(),
    dealId: "deal1",
  },
];

export const getAllNotes = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockNotes);
  const notes = await prisma.note.findMany({
    include: { creator: true, deal: true },
  });
  res.json(notes);
};

export const getNoteById = async (req: Request, res: Response) => {
  if (useMock) {
    const note = mockNotes.find((n) => n.id === req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.json(note);
  }
  const note = await prisma.note.findUnique({
    where: { id: req.params.id },
    include: { creator: true, deal: true },
  });
  if (!note) return res.status(404).json({ error: "Note not found" });
  res.json(note);
};

export const createNote = async (req: Request, res: Response) => {
  if (useMock)
    return res
      .status(201)
      .json({
        ...req.body,
        id: "mock-note",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  const note = await prisma.note.create({ data: req.body });
  res.status(201).json(note);
};

export const updateNote = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.note.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
