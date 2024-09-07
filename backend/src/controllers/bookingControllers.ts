import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-08-16' });

export const createBooking = async (req: any, res: any) => {
  const { turfId, startTime, endTime } = req.body;
  
  try {
    // Calculate the total cost (you need to implement this logic)
    const totalCost = calculateTotalCost(startTime, endTime);

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Turf Booking',
            },
            unit_amount: totalCost * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
    });

    // Create a pending booking in the database
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        turfId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalCost,
        status: 'PENDING',
        stripePaymentId: session.id,
      },
    });

    // Return the session ID to the client
    res.json({ sessionId: session.id, bookingId: booking.id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create booking' });
  }
};

// Implement this function based on your pricing logic
function calculateTotalCost(startTime: string, endTime: string): number {
  // Your logic here
  return 1000; // Example fixed price
}

// Add a webhook handler to update the booking status when payment is completed
export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Update the booking status to CONFIRMED
    await prisma.booking.update({
      where: { stripePaymentId: session.id },
      data: { status: 'CONFIRMED' },
    });
  }

  res.json({ received: true });
};

// Update a booking
//app.put('/bookings/:id', authMiddleware, 
  export const updateBooking =  async (req: any, res:any) => {
  const { id } = req.params;
  const { startTime, endTime, status } = req.body;
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { 
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status,
      },
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update booking' });
  }
};

// Delete a booking
//app.delete('/bookings/:id', authMiddleware, 
  export const deleteBooking = async (req: any, res:any) => {
  const { id } = req.params;
  try {
    await prisma.booking.delete({ where: { id } });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete booking' });
  }
};