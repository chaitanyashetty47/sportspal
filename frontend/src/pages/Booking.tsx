import { useState,useEffect, useCallback} from "react"
import { useParams } from 'react-router-dom';
import { generateTimeSlots } from '@/utils/timeSlotGenerator';
import { Card, CardContent, CardFooter,CardHeader,CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import SportsSelector from '@/components/SportsSelector'
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Trash2, ShoppingCart } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Header from "@/components/Header";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


type CartItem = {
  id: string
  court: string
  date: string
  time: string
  duration: number
  price: number
}

 
  interface TurfTiming {
    startTime: string;
    endTime: string;
  }

 
  // interface TurfBookingProps {
  //   turfId?: string;
  // }

  interface TurfInfo {
    id: string;
    name: string;
    hourlyRate: number;
  }

export default function TurfBookingApp() {

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)
  const [timeSlots, setTimeSlots] = useState<string[]>(["05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"]);
  const [time, setTime] = useState(timeSlots[0])
  const [court, setCourt] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [turfs, setTurfs] = useState<TurfInfo[]>([]);
  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [ error, setError] = useState('No Error');
  const {playgroundName,playgroundId} = useParams();
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(user);
      setUser(user);
    };
    fetchUser();
  }, []);
  
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      // Assume the first item in cart for simplicity. Adjust as needed for multiple items.
      console.log("cart is ", cart);
      console.log("turf are: ", turfs);
      const bookings = cart.map(item => {
        const selectedTurf = turfs.find(turf => turf.name === item.court);
        if (!selectedTurf) throw new Error(`Selected turf not found for ${item.court}`);
  
        console.log("selected turf is ", selectedTurf);
        const startTime = new Date(`${item.date} ${item.time}`);
        const endTime = new Date(startTime.getTime() + item.duration * 60 * 60 * 1000);
  
        return {
          turfId: selectedTurf.id,
          userEmail: user.email, // Assuming you have user object with id
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          totalCost: item.price,
          status: 'PENDING',
        };
      });
      
      console.log("bookings are ", bookings);
      const response = await fetch(`${BACKEND_URL}/playgrounds/${playgroundId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings }),
      });

      if (!response.ok) {
        if(response.status === 400){
          setAlertMessage("This timeslot is already booked");
          setIsAlertOpen(true);
        }
      }
      else{
        setCart([]);
        setAlertMessage('Bookings created successfully');
        setIsAlertOpen(true);
      }

      

    } catch (error) {
      console.error('Error in checkout:', error);
    }
  };
  
  
  const handleSportChange = useCallback((sport: string) => {
    console.log("Selected sport:", sport);
    setSelectedSport(sport);
  }, []);

  // const handleCourtChange = (court: string) => {
  //   setCourt(court);
  // }




  const addToCart = () => {
    if(cart.length === 1){
      setAlertMessage("you can only book one turf at a time");
      setIsAlertOpen(true);
      return;
    }
    if (!court || !date || !time ) return

    const selectedTurf = turfs.find(turf => turf.name === court);
    if (!selectedTurf) {
      setAlertMessage("Selected court not found. Please try again.");
      setIsAlertOpen(true);
      return;
    }

    const isOverlapping = (existingStart: Date, existingEnd: Date, newStart: Date, newEnd: Date) => {
      return (newStart < existingEnd && newEnd > existingStart);
    };

    const existingItem = cart.find(item => {
      const existingStart = new Date(`${item.date} ${item.time}`);
      const existingEnd = new Date(existingStart.getTime() + item.duration * 60 * 60 * 1000);
      const newStart = new Date(`${date.toLocaleDateString()} ${time}`);
      const newEnd = new Date(newStart.getTime() + duration * 60 * 60 * 1000);

      return item.court === court && isOverlapping(existingStart, existingEnd, newStart, newEnd);
    });

    if (existingItem) {
      setAlertMessage("This timeslot overlaps with an existing booking in your cart.");
      setIsAlertOpen(true);
      return;
    }

    const newItem: CartItem = {
      id: uuidv4(),
      court,
      date: date.toLocaleDateString(),
      time,
      duration,
      price: selectedTurf.hourlyRate * duration // Assuming 1000 INR per hour
    }
    setCart([...cart, newItem])

      // Clear fields after adding to cart
  setCourt('');
  setDate(undefined);
  setTime(timeSlots[0]);
  setDuration(1);

  // Provide feedback to the user
  setAlertMessage("Item added to cart successfully!");
  setIsAlertOpen(true);
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  
  
  //default
  
  const fetchTimings = useCallback(async () => {
    try {
     
      const response = await axios.get(`${BACKEND_URL}/playgrounds/${playgroundId}/timings`);
      
      if (response.status === 200) {
        const turfTiming: TurfTiming = response.data;
        const slots = generateTimeSlots(turfTiming.startTime, turfTiming.endTime);
        setTimeSlots(slots);
        console.log("time slots are ", slots);
      } else {
        throw new Error('Failed to fetch turf timing');
      }
    } catch (err) {
      //setError('Failed to fetch turf data');
      console.error(err);
    } finally {
      //setLoading(false);
    }
  }, [playgroundId]);

  const fetchTurfs = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/playgrounds/${playgroundId}/turfs/${selectedSport}`);
      console.log("turfs are ", response.data);
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
 
  const handleDurationChange = (amount:number) => {
    setDuration(duration + amount)
  }
  // const handleTicketChange = (amount:number) => {
  //   setTickets(tickets + amount)
  // }
  return (
    <div>

    
    <Header/>
    <div className="flex flex-col gap-8 md:flex-row">
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold">Book Before The Slot Gets Occupied!!!</h1>
      <p className="text-muted-foreground">{playgroundName}</p>
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
          <Button disabled={cart.length !== 1} onClick={handleCheckout}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
          </Button>
        </CardFooter>
  </Card>
  <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Booking Status</AlertDialogTitle>
      <AlertDialogDescription>
        {alertMessage}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction onClick={() => setIsAlertOpen(false)}>OK</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
  </AlertDialog>
  </div>
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




