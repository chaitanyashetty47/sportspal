import Header from '@/components/Header';
import SportsCard from '@/components/SportsCard';
import { Playground,Turf } from '@/types/interface'; 
import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import turfImg from "../assets/turf.png";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function PlaygroundDisplay() {

  const navigate = useNavigate();
  const [playground, setPlayground] = useState<Playground>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {playgroundName, playgroundId } = useParams();

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/playgrounds/${playgroundId}`);
        setPlayground(response.data);
      } catch (err) {
        setError('Failed to fetch turf data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [playgroundId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playground) return <div>No playground found</div>;

  return (
    <div>
      <Header/>
      <div className='mx-4 lg:mx-20 mt-12 md:mt-10'>
        <nav className="flex items-center flex-wrap text-gray-500 text-sm font-medium ">
          <a className="hover:text-primary hover:underline" href="/home">Venues</a>
          <span className="mx-2">&gt;</span>
          <a className="hover:text-primary hover:underline" href="/home">Mumbai</a>
          <span className="mx-2">&gt;</span><span>{playgroundName}</span>
        </nav> 
       
       {/* title name  */}
        <div className='w-full mt-8'>
          <div className="flex flex-col justify-between w-full ">
            <div className="grid w-full md:h-24 grid-flow-row-dense grid-cols-3 grid-rows-2 gap-y-1 md:gap-y-0 md:gap-x-5 ">
              
              <div className="w-full col-span-3">
                <h1 className="md:font-bold md:text-[32px] md:leading-[36px] font-bold text-[24px] leading-[36px] text-typography overflow-hidden md:whitespace-nowrap whitespace-normal">{playground.name}</h1>
              </div>
              
              <div className ="flex items-center w-full col-span-3 md:col-span-2">
                <div className="flex flex-col w-full sm:items-center sm:justify-start sm:flex-row">
                  <div className=" text-[#515455] font-medium text-md ">{playground.address}</div>
                </div> 
              </div>

              <div className="flex z-10 flex-row w-full col-span-3 mt-3 space-x-2 md:mt-0 sm:col-span-2 md:col-span-1 ">
                <div className="flex flex-col items-center justify-start w-full space-y-3">
                  <div className="w-full ">
                    <div>
                      <button className="w-full h-12 px-3 py-2 font-semibold text-white border_radius bg-primary"
                      onClick={() => navigate(`/book/${playgroundName}/${playgroundId}`)} > Book Now
                        </button>
                    </div>

                  </div>
                  <div className="flex flex-row items-center justify-start w-full space-x-2">
                    <button className="flex items-center justify-center w-full h-12 space-x-2 font-semibold text-black border-2 cursor-pointer hover:bg-surface border_radius border_container" aria-label='Share Button'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " fill="none" viewBox="0 0 24 24" stroke="black" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    <div>Share</div>
                    </button>
                    <div></div>
                    <button className="w-full h-12 px-3 py-2 font-semibold text-sm md:text-md border-primary border text-primary rounded-md bg-white" aria-label='Bulk Book'>Bulk / Corporate </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 mt-6 md:gap-x-5 md:grid-cols-3">
            <div className="hidden w-full row-span-1 bg-opacity-50 border_radius backdrop-blur-lg bg-surface md:block md:col-span-2 ">
              <img
                src={turfImg}
                alt="Turf Cover Image"
                width={495}
                height={185}
                className="object-cover w-full h-full"
                style={{ aspectRatio: "495/185", objectFit: "cover" }}
              />
            </div>
            <div className="w-full border_radius z-0 md:row-span-2">
              <div className="flex flex-col md:mt-14 ">
                <div className="flex flex-col p-4 border border_radius border-border_color ">
                  <h2 className="font-semibold text-md md:text-lg">Timing</h2>
                  <div className="mt-2 leading-1">{playground.startTime} - {playground.endTime}</div>
                </div>
                <div className="flex flex-col h-auto p-4 mt-5 border border_radius border-border_color ">
                  <div className="font-semibold text-md md:text-lg">Location</div>
                  <h2 className='my-2'>{playground.address}</h2>
                  <div className = 'h-16 bg-green-400'>
                      Maps
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border_radius md:row-span-5 md:col-span-2">
            <div className="flex flex-col justify-start md:items-center md:flex-row">
              <h2 className="font-semibold text-md md:text-lg">Sports Available</h2>
              <div className="text-sm text-gray-500 md:ml-2">(Click on sports to view price chart)</div>
            </div>
            <div className="grid items-center w-full grid-cols-3 gap-5 mt-5 sm:gap-6 sm:grid-cols-5 lg:gap-6 xl:grid-cols-7 border_container ">
            {playground.turfs.map((turf:Turf) => (
                <SportsCard key={turf.id} turf={turf} />
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-5 mb-5">
            <div className="p-6 border border_radius border-border_color">
              <h3 className='font-semibold text-md'>Amenities</h3>
              <div className="grid grid-cols-2 gap-2 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-y-6 ">
                <div className="flex flex-row items-start space-x-2 text-sm capitalize md:text-md ">
                  <div className='relative h-6 min-w-max'>
                    <span className='box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%'>
                      <span className="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"></span>
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10.5C0 4.97715 4.47715 0.5 10 0.5C12.6522 0.5 15.1957 1.55357 17.0711 3.42893C18.9464 5.3043 20 7.84784 20 10.5C20 16.0228 15.5228 20.5 10 20.5C4.47715 20.5 0 16.0228 0 10.5ZM8.73 13.85L14.35 8.23C14.5341 8.03685 14.5341 7.73315 14.35 7.54L13.82 7.01C13.6256 6.81943 13.3144 6.81943 13.12 7.01L8.38 11.75L6.88 10.26C6.78927 10.1633 6.66259 10.1085 6.53 10.1085C6.39741 10.1085 6.27073 10.1633 6.18 10.26L5.65 10.79C5.55534 10.8839 5.5021 11.0117 5.5021 11.145C5.5021 11.2783 5.55534 11.4061 5.65 11.5L8.03 13.85C8.12073 13.9467 8.24741 14.0015 8.38 14.0015C8.51259 14.0015 8.63927 13.9467 8.73 13.85Z" fill="#00B562"/>
                        </svg>
                    </span>
                  </div>
                  <h4>Parking</h4>
                </div>
                <div className="flex flex-row items-start space-x-2 text-sm capitalize md:text-md ">
                  <div className='relative h-6 min-w-max'>
                    <span className='box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%'>
                      <span className="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"></span>
                      <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10.5C0 4.97715 4.47715 0.5 10 0.5C12.6522 0.5 15.1957 1.55357 17.0711 3.42893C18.9464 5.3043 20 7.84784 20 10.5C20 16.0228 15.5228 20.5 10 20.5C4.47715 20.5 0 16.0228 0 10.5ZM8.73 13.85L14.35 8.23C14.5341 8.03685 14.5341 7.73315 14.35 7.54L13.82 7.01C13.6256 6.81943 13.3144 6.81943 13.12 7.01L8.38 11.75L6.88 10.26C6.78927 10.1633 6.66259 10.1085 6.53 10.1085C6.39741 10.1085 6.27073 10.1633 6.18 10.26L5.65 10.79C5.55534 10.8839 5.5021 11.0117 5.5021 11.145C5.5021 11.2783 5.55534 11.4061 5.65 11.5L8.03 13.85C8.12073 13.9467 8.24741 14.0015 8.38 14.0015C8.51259 14.0015 8.63927 13.9467 8.73 13.85Z" fill="#00B562"/>
                        </svg>
                    </span>
                  </div>
                  <h4>Restroom</h4>
                </div>
              </div>

            </div>
          </div>

          

        </div>

      </div>
      
    </div>
  );
}

export default PlaygroundDisplay;




