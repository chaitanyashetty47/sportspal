import { useState,useEffect, useCallback} from "react"
import { useParams } from 'react-router-dom';
import { generateTimeSlots } from '@/utils/timeSlotGenerator';
import { Card, CardContent, CardFooter,CardHeader,CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import SportsSelector from '@/components/SportsSelector'
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Trash2, ShoppingCart, Clock } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { loadStripe } from '@stripe/stripe-js';


type CartItem = {
  id: string
  court: string
  date: string
  time: string
  duration: number
  price: number
}

  //claude
  interface TurfTiming {
    startTime: string;
    endTime: string;
  }

  //claude
  interface TurfBookingProps {
    turfId?: string;
  }

  interface TurfInfo {
    name: string;
    hourlyRate: number;
  }

  const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLIC_KEY!);

export default function TurfBookingApp({turfId}:TurfBookingProps) {


  const [selectedSport, setSelectedSport] = useState<string>('');

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Assume the first item in cart for simplicity. Adjust as needed for multiple items.
      const item = cart[0];
      
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turfId: item.court,
          startTime: new Date(`${item.date} ${item.time}`).toISOString(),
          endTime: new Date(`${item.date} ${item.time}`).toISOString(), // Add duration to this
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        // Handle any errors from Stripe Checkout
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error in checkout:', error);
    }
  };
  
  
  const handleSportChange = useCallback((sport: string) => {
    console.log("Selected sport:", sport);
    setSelectedSport(sport);
  }, []);

  const handleCourtChange = (court: string) => {
    setCourt(court);
  }

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<string[]>(["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"]);
  const [time, setTime] = useState(timeSlots[0])
  const [court, setCourt] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [turfs, setTurfs] = useState<TurfInfo[]>([]);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('No Error');

  const {playgroundId} = useParams();


  const addToCart = () => {
    if (!court || !date || !time) return

      // Check if an item with the same court, date, and time already exists in the cart
  const existingItem = cart.find(item => 
    item.court === court &&
    item.date === date.toLocaleDateString() &&
    item.time === time
  );

  if (existingItem) {
    // If the item already exists, you can either show an alert or update the existing item
    alert("This timeslot is already in your cart.");
    return;
  }

    const newItem: CartItem = {
      id: uuidv4(),
      court,
      date: date.toLocaleDateString(),
      time,
      duration,
      price: 1000 * duration // Assuming 1000 INR per hour
    }
    setCart([...cart, newItem])

      // Clear fields after adding to cart
  setCourt('');
  setDate(undefined);
  setTime(timeSlots[0]);
  setDuration(1);

  // Provide feedback to the user
  alert("Item added to cart successfully!");
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  
  
  //default
  
  const fetchTimings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/playgrounds/${playgroundId}/timings`);
      
      if (response.status === 200) {
        const turfTiming: TurfTiming = response.data;
        const slots = generateTimeSlots(turfTiming.startTime, turfTiming.endTime);
        setTimeSlots(slots);
        console.log("time slots are ", slots);
      } else {
        throw new Error('Failed to fetch turf timing');
      }
    } catch (err) {
      setError('Failed to fetch turf data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [playgroundId]);

  const fetchTurfs = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/playgrounds/${playgroundId}/turfs/${selectedSport}`);
      setTurfs(response.data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    }
  }, [playgroundId, selectedSport]);

  const debouncedFetchTurfs = useCallback(debounce(fetchTurfs, 300), [fetchTurfs]);

  useEffect(() => {
    fetchTimings();
  }, [fetchTimings]);

  useEffect(() => {
    if (selectedSport) {
      debouncedFetchTurfs();
    }
  }, [selectedSport, debouncedFetchTurfs]);


  const [duration, setDuration] = useState(1)
  const [tickets, setTickets] = useState(0)
  const handleDurationChange = (amount:number) => {
    setDuration(duration + amount)
  }
  const handleTicketChange = (amount:number) => {
    setTickets(tickets + amount)
  }
  return (
    <div className="flex flex-col gap-8 md:flex-row">
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold">Game Theory - Joseph's Indian Vittal Mallya Road</h1>
      <p className="text-muted-foreground">St Joseph's</p>
      <div className="my-4 p-2 bg-green-500 text-white text-center rounded-md">
        Earn 3 karma points on every booking!
      </div>
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sports">Sports</Label>
            <SportsSelector onSportChange={handleSportChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left font-normal">
                  {date ? date.toLocaleDateString() : "Select a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  disabled={(date: Date) => {
                    const today = new Date();
                    const next30Days = new Date();
                    next30Days.setDate(today.getDate() + 30);
                
                    return date < today || date > next30Days;
                  }}
                  onSelect={(selectedDate: Date | undefined) => {
                    setDate(selectedDate);
                    setIsDatePopoverOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Popover open={isTimePopoverOpen} onOpenChange={setIsTimePopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left font-normal">
                  {time}
                  <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent className="w-auto p-0" align="start">
              <div className="grid grid-cols-2 gap-2 p-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant="ghost"
                        className={time === slot ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => {
                          setTime(slot);
                          setIsTimePopoverOpen(false);
                        }}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>   {/* //check this out */}
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="duration">Duration</Label>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => handleDurationChange(-1)}
              disabled={duration <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span>{duration} Hr</span>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleDurationChange(1)}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div>
              <label className="block mb-2">Court</label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select Court--" />
                </SelectTrigger>
                <SelectContent>
                  {
                    turfs.map((turf) => (
                      <SelectItem key={turf.name} value={turf.name}>
                        {turf.name} - INR {turf.hourlyRate}/hr
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="secondary"  onClick={addToCart}>
            Add To Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
    <Card className="w-full md:w-1/2">
    <CardHeader>
      <CardTitle>Cart ({cart.length})</CardTitle>
    </CardHeader>
    {/* <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>6 a side Turf 1</span>
          </div>
          <TrashIcon className="h-4 w-4 text-red-500" />
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4" />
          <span>03, September 2024</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-4 w-4" />
          <span>05:00 PM to 07:00 PM</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSignIcon className="h-4 w-4" />
          <span>INR 2000</span>
        </div>
        <div className="bg-gray-100 text-center py-2 rounded-md">Wohoo! You can now avail INR150 OFF 🎉.</div>
        <Button className="w-full bg-green-500 text-white">Proceed INR 2000.00</Button>
      </div>
    </CardContent> */}
    <CardContent>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
              <div>
                <p><strong>{item.court}</strong></p>
                <p>{item.date}, {item.time}</p>
                <p>{item.duration} hour(s)</p>
                <p>INR {item.price}</p>
              </div>
              <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-lg font-bold">Total: INR {totalPrice}</p>
          <Button disabled={cart.length === 0} onChange={handleCheckout}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
          </Button>
        </CardFooter>
  </Card>
  </div>
  )
}

function CalendarIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function ClockIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function DollarSignIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function TrashIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function FishIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
      <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
      <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
      <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
    </svg>
  )
}


function MinusIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}


function PlusIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}