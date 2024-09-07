import React, { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import PlaygroundCard from '@/components/PlaygroundCard';

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Playground {
  id: string;
  name: string;
  address: string;
  sports: string[];
  turfs: Turf[];
}

interface Turf {
  id: string;
  name: string;
  type: 'FOOTBALL' | 'CRICKET' | 'BADMINTON';
  hourlyRate: number;
  playgroundId: string;
}

export const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const fetchPlaygrounds = async () => {
      const response = await fetch('https://api.example.com/playgrounds'); 
      if (!response.ok) {
        throw new Error('Failed to fetch playgrounds');
      }
      const data = await response.json();
       setPlaygrounds(data);
    };
    fetchPlaygrounds();
  }, []);

  return (
    <div>
      <Header />
      <h1>Welcome to the Sports Turf Booking System</h1>
      {user && <p>Logged in as: {user.email}</p>}
      <div className='lg:mx-20 mt-8'>
        <div className='grid w-full grid-cols-1 justify-items-center'>
          <div className="w-full col-span-1 pb-10 px-2 md:px-0 ">
            <span></span>
            <div className="flex flex-row mb-4 md:mb-8 items-center justify-center "></div>
            <div className="grid w-full grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {playgrounds.map((playground:Playground) => (
                <PlaygroundCard key={playground.id} playground={playground} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};