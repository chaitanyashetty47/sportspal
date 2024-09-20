import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPlaygrounds = async (req:Request, res:Response) => {
  try {
    const playgrounds = await prisma.playground.findMany({
      
      select: {
        id: true,
        name: true,
        address:true,
        turfs: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      }
    });

    const playgroundsWithSports = playgrounds.map(playground => ({
      id: playground.id,
      name: playground.name,
      address: playground.address,
      sports: [...new Set(playground.turfs.map(turf => turf.type))],
      turfs: playground.turfs,
    }));

    res.json(playgroundsWithSports);
  } catch (error) {
    console.error('Error fetching playgrounds:', error);
    res.status(500).json({ error: 'An error occurred while fetching playgrounds' });
  }
};

//get individul playground detaiks
// app.get('/playgrounds/:playgroundName/:playgroundId', 
  export const getPlaygroundDetails =  async (req:Request, res:Response) => {
  const { playgroundId } = req.params;
  try {
    const playground = await prisma.playground.findUnique({
      where: { id: playgroundId },
      select: {
        address: true,
        name: true,
        turfs: true,
        startTime: true,
        endTime: true,
      },
    });
    
    if (!playground) {
      return res.status(404).json({ error: 'Playground not found' });
    }
    
    res.json(playground);
  } catch (error) {
    console.error('Error fetching playground:', error);
    res.status(500).json({ error: 'An error occurred while fetching playground information' });
  }
};



//returns all the turfs available in a playground
// app.get('/playgrounds/:playgroundId/turfs', 
  export const getTurfsByPlayground =  async (req:Request, res:Response) => {
  const { playgroundId } = req.params;
  try {
    const turfs = await prisma.turf.findMany({
      where: {playgroundId: playgroundId },
    });
    res.json(turfs);
  } catch (error) {
    console.error('Error fetching turfs:', error);
    res.status(500).json({ error: 'An error occurred while fetching turfs' });
  }
};


// returns the timings  in a playground
// app.get('/playgrounds/:playgroundId/timings', 
export const getTimingsByPlayground = async (req: Request, res: Response) => {
  const { playgroundId } = req.params;

  try {
    const playground = await prisma.playground.findUnique({
      where: { id: playgroundId },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    if (!playground) {
      return res.status(404).json({ error: 'Playground not found, the id is incorrec' });
    }

    res.json({
      startTime: playground.startTime,
      endTime: playground.endTime,
    });
  } catch (error) {
    console.error('Error fetching timings:', error);
    res.status(500).json({ error: 'Error fetching playground timings' });
  }
};

//return plyground by turf id
export const getPlaygroundByTurfId = async (req: Request, res: Response) => {
  const { turfId } = req.params;
  try {
    const playground = await prisma.playground.findUnique({
      where: { id: turfId },
      select: {
        id: true,
        name: true,
        address: true,
      },
    });
    res.json(playground);
  } catch (error) {
    console.error('Error fetching playground by turf id:', error);
    res.status(500).json({ error: 'Error fetching playground by turf id' });
  }
};  


