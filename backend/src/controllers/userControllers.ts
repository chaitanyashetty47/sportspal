import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrUpdateUser = async (req: Request, res: Response) => {
  try {
    const { supabaseId, email } = req.body;

    const user = await prisma.user.upsert({
      where: { supabaseId: supabaseId },
      update: {
        email,
      },
      create: {
        supabaseId,
        email,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
};

// //get users by email
// export const getUsersByEmail = async (req: Request, res: Response) => {
//   try {
//     const { email } = req.body;

//     const users = await prisma.user.findMany({
//       where: { email },
//     });
//   } catch (error) {
//     console.error('Error getting users by email:', error);
//     res.status(500).json({ error: 'Failed to get users by email' });
//   }
// };

//get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Failed to get all users' });
  }
};
