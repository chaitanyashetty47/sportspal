import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSportsByPlayground = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;
  try {
    const sports = await prisma.turf.findMany({
      where: { playgroundId },
      distinct: ['type'],
      select: { type: true },
    });
    res.json(sports);
  } catch (error) {
    console.error('Error fetching sports:', error);
    res.status(500).json({ error: 'An error occurred while fetching sports' });
  }
};
