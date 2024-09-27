import  { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PlaygroundCard from '@/components/PlaygroundCard';
//import { useUser } from '@/hooks/useUser';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [user, setUser] = useState<any>(null);
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [filteredPlaygrounds, setFilteredPlaygrounds] = useState<Playground[]>([]);
 // const { user } = useUser();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPlaygrounds(query);
  };

  const filterPlaygrounds = (query: string) => {
    if (!query) {
      setFilteredPlaygrounds(playgrounds);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = playgrounds.filter((playground) => 
      playground.name.toLowerCase().includes(lowercaseQuery) ||
      playground.sports.some(sport => sport.toLowerCase().includes(lowercaseQuery)) ||
      playground.turfs.some(turf => 
        turf.name.toLowerCase().includes(lowercaseQuery) ||
        turf.type.toLowerCase().includes(lowercaseQuery)
      )
    );
    setFilteredPlaygrounds(filtered);
  };

  useEffect(() => {
    // const fetchUser = async () => {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   console.log(user);
    //   setUser(user);
    // };
    // fetchUser();

    const fetchPlaygrounds = async () => {
      const response = await fetch(`${BACKEND_URL}/playgrounds`);
      if (!response.ok) {
        throw new Error('Failed to fetch playgrounds');
      }
      const data = await response.json();
      setPlaygrounds(data);
      setFilteredPlaygrounds(data);
    };
    fetchPlaygrounds();
  }, []);

  return (
    <div>
      <Header onSearch={handleSearch}  />
      {/* <h1>Welcome to the Sports Turf Booking System</h1> */}
      {/* {user && <p>Logged in as: {user.email}</p>} */}
      {searchQuery && <p>Search results for: {searchQuery}</p>}
      <div className='lg:mx-20 mt-8'>
        <div className='grid w-full grid-cols-1 justify-items-center'>
          <div className="w-full col-span-1 pb-10 px-2 md:px-0 ">
            <span></span>
            <div className="flex flex-row mb-4 md:mb-8 items-center justify-center "></div>
            <div className="grid w-full grid-cols-1 gap-11 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredPlaygrounds.map((playground: Playground) => (
                <PlaygroundCard key={playground.id} playground={playground} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}