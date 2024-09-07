import { useState } from 'react'
import { Trash2, ShoppingCart, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import SportsSelector from '@/components/SportsSelector'
import { useEffect } from 'react'
import  {generateTimeSlots}  from '@/utils/timeSlotGenerator'
import { v4 as uuidv4 } from 'uuid';

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

const timeSlots = [
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"
]

export default function TurfBookingApp({turfId}:TurfBookingProps) {
  const [selectedSport, setSelectedSport] = useState<string>('');

  const handleSportChange = (sport: string) => {
    setSelectedSport(sport);
  };
  
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [duration, setDuration] = useState(1)
  const [court, setCourt] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])



  const addToCart = () => {
    if (!court || !date || !time) return
    const newItem: CartItem = {
      id: uuidv4(),
      court,
      date,
      time,
      duration,
      price: 1000 * duration // Assuming 1000 INR per hour
    }
    setCart([...cart, newItem])
    setCourt('')
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  useEffect(() => {
    const fetchTurfTiming = async () => {
      try {
        const response = await fetch(`http://localhost:3000/playgrounds/${turfId}/timings`);
        if (!response.ok) {
          throw new Error('Failed to fetch turf timing');
        }
        const turfTiming: TurfTiming = await response.json();
        const slots = generateTimeSlots(turfTiming.startTime, turfTiming.endTime);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching turf timing:', error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchTurfTiming();
  }, [turfId]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Battlefield-Little Angels Turf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Sports</label>
              <SportsSelector onSportChange={handleSportChange} />
            </div>
            <div>
              <label className="block mb-2">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block mb-2">Start Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {time ? time : "Select time"}
                    <Clock className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant="ghost"
                        className={time === slot ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block mb-2">Duration (hours)</label>
              <Input type="number" min="1" max="5" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2">Court</label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select Court--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 a side Turf 1">6 a side Turf 1</SelectItem>
                  <SelectItem value="6 a side Turf 2">6 a side Turf 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addToCart}>Add to Cart</Button>
        </CardFooter>
      </Card>

      <Card>
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
          <Button disabled={cart.length === 0}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}