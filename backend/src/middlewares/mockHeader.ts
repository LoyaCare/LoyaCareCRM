import { Request, Response, NextFunction } from 'express';

export const addMockHeader = (_req: Request, res: Response, next: NextFunction) => {
  const useMock = process.env.USE_MOCK === "true";
  res.setHeader("X-Mock-Mode", useMock.toString());
  next();
};