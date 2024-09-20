import { Request, Response } from 'express';
import { PrismaClient , TurfType} from '@prisma/client';

const prisma = new PrismaClient();

export const getTurfsByPlayground = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;
  try {
    const turfs = await prisma.turf.findMany({
      where: { playgroundId },
    });
    res.json(turfs);
  } catch (error) {
    console.error('Error fetching turfs:', error);
    res.status(500).json({ error: 'An error occurred while fetching turfs' });
  }
};


interface TurfInfo {
  id: string;
  name: string;
  hourlyRate: number;
}

//get turfs by sport and playground

async function getTurfsBySportAndPlayground(
  playgroundId: string,
  sportType: TurfType
): Promise<TurfInfo[]> {
  try {
    const turfs = await prisma.turf.findMany({
      where: {
        playgroundId: playgroundId,
        type: sportType,
      },
      select: {
        id: true,
        name: true,
        hourlyRate: true,
      },
    });

    return turfs;
  } catch (error) {
    console.error('Error fetching turfs:', error);
    throw error;
  }
}

export const getTurfsForPlaygroundAndSport = async (req: Request, res: Response) => {
  const { playgroundId, sportType } = req.params;

  try {
    const turfs = await getTurfsBySportAndPlayground(playgroundId, sportType as TurfType);
    
    if (turfs.length > 0) {
      res.json(turfs);
    } else {
      res.status(404).json({ error: 'No turfs found for the specified sport and playground' });
    }
  } catch (error) {
    console.error('Error in getTurfsForPlaygroundAndSport:', error);
    res.status(500).json({ error: 'An error occurred while fetching the turfs' });
  }
};