import { Request, Response } from 'express';
import prisma from '../prisma/client';

const useMock = process.env.USE_MOCK === 'true';
const mockUsers = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com', password: '', createdAt: new Date(), updatedAt: new Date() },
  { id: 'user2', name: 'Bob', email: 'bob@example.com', password: '', createdAt: new Date(), updatedAt: new Date() }
];

export const getAllUsers = async (_req: Request, res: Response) => {
  if (useMock) return res.json(mockUsers);
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  if (useMock) {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  }
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  if (useMock) return res.status(201).json({ ...req.body, id: 'mock-user' });
  const user = await prisma.user.create({ data: req.body });
  res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  if (useMock) return res.json({ ...req.body, id: req.params.id });
  const user = await prisma.user.update({ where: { id: req.params.id }, data: req.body });
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  if (useMock) return res.status(204).end();
  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
