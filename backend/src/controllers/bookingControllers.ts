import { Request, Response } from 'express';
import { Booking } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface BookingData {
  turfId: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: string;
}



export const createBookings = async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;
    console.log('Received booking data:', bookingData);

    if (!bookingData.bookings || bookingData.bookings.length === 0) {
      return res.status(400).json({ error: 'No booking data provided' });
    }

    const booking: BookingData = bookingData.bookings[0];
    console.log('Processing booking:', booking);

    if (!booking.userEmail) {
      console.log('User email is missing. Booking object:', booking);
      return res.status(400).json({ error: 'User email is required' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: booking.userEmail }
    });

    if (!user) {
      console.log('User not found for email:', booking.userEmail);
      return res.status(400).json({ error: 'User not found' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        turfId: booking.turfId,
        AND: [
          {
            startTime: {
              lt: new Date(booking.endTime)
            }
          },
          {
            endTime: {
              gt: new Date(booking.startTime)
            }
          }
        ]
      }
    });

    if (overlappingBooking) {
      console.log('Overlapping booking found:', overlappingBooking);
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    const createdBooking = await prisma.booking.create({
      data: {
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        totalCost: booking.totalCost,
        turfId: booking.turfId,
        userEmail: booking.userEmail,
        status: 'CONFIRMED',
      },
      include: {
        turf: true,
        user: true,
      },
    });
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Failed to create booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getBookingsByUser = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;
    const bookings = await prisma.booking.findMany({
      where: {
        userEmail: userEmail,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        totalCost: true,
        status: true,
        turf: {
          select: {
            name: true,
            playground:{
              select:{
                name:true,
              }
            }
         }
        }
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Failed to get bookings by user:', error);
    res.status(500).json({ error: 'Failed to get bookings by user' });
  }
};
