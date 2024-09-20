import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '@/components/Header';
import { useUser } from '@/hooks/useUser';


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
interface Booking {
    id: string;
    startTime: string;
    endTime: string;
    totalCost: number;
    status: string;
    turf: {
        name: string;
        playground: {
            name: string;
        };
    };
}

export const Profile = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showUpcoming, setShowUpcoming] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        // Fetch bookings from your API
        const fetchBookings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/playgrounds/${user?.email}/bookings`);
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    const TabButton = ({ 
        label, 
        isActive, 
        onClick 
    }: { 
        label: string; 
        isActive: boolean; 
        onClick: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive 
                    ? 'bg-gray-200 text-black' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            style={{
                flex: 1,
                border: 'none',
                outline: 'none',
            }}
        >
            {label}
        </button>
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredBookings = showUpcoming
        ? bookings.filter(booking => new Date(booking.startTime) >= new Date())
        : bookings;

    return (
        <div>
            <Header/>
            <div className="grid grid-cols-12 gap-3 my-10 md:relative pt-14 md:pt-16 md:pb-5">
                <div className="fixed bottom-0 left-0 right-0 z-10 order-last w-full bg-white border-2 md:pt-5 md:h-screen md:sticky border_container md:top-0 md:left-0 md:order-first cols-span-12 md:col-span-3">
                    <div className="z-40 flex flex-row justify-center w-full h-fit md:flex-col">
                        <div className="items-center hidden py-4 space-y-1 border-b md:flex md:flex-col">
                          <div className="bg-gray-600 w-20 h-20 rounded-full"></div>
                          <div className="text-sm font-normal">{user?.email}</div>
                          <div className="text-sm font-medium">7873939032</div>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full md:flex-col">
                          <div className="text-white bg-primary flex flex-col md:flex-row w-full items-center md:space-x-5 py-3 md:px-5 cursor-pointer">
                            <span className="flex flex-row items-center justify-center w-full text-sm text-center md:justify-start md:text-md md:font-medium md:w-full">All Bookings</span>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-9">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-lg font-semibold mb-4">Bookings</h2>
                        <div className="flex rounded-md overflow-hidden border border-gray-300">
                            <TabButton 
                                label="UPCOMING BOOKINGS" 
                                isActive={showUpcoming} 
                                onClick={() => setShowUpcoming(true)}
                            />
                            <TabButton 
                                label="ALL BOOKINGS" 
                                isActive={!showUpcoming} 
                                onClick={() => setShowUpcoming(false)}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{booking.turf.playground.name}</CardTitle>
                                    <span className={`font-bold ${
                                        booking.status === 'CONFIRMED' ? 'text-green-600' :
                                        booking.status === 'PENDING' ? 'text-gray-600' : 'text-red-600'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <p><strong>Turf:</strong> {booking.turf.name}</p>
                                    <p><strong>Date:</strong> {formatDate(booking.startTime)}</p>
                                    <p><strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                                    <p><strong>Total Cost:</strong> ₹{booking.totalCost}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}