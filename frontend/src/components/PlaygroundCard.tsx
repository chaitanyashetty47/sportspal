import { Card } from "@/components/ui/card"
import turfImg from "../assets/turf-img.png";
import { Link } from "react-router-dom";
import  SportsIcon from "./SportsIcon";


// interface Turf {
//   id: string;
//   name: string;
//   type: string;
//   hourlyRate: number;
//   playgroundId: string;
//   playground?: {
//     name: string;
//     address: string;
//   };
// }

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


export default function PlaygroundCard({playground}: {playground:Playground}) {
  const displayTurfs = playground.turfs.slice(0, 3);
  const remainingCount = Math.max(playground.turfs.length - 3, 0);

  return (
    <Card className="w-full max-w-sm">
      <Link to={`/turf/${playground.name}/${playground.id}`}/>

      <div className="grid grid-rows-[58%_42%] gap-0 rounded-lg overflow-hidden border_radius bg-white card_shadow pb-2 cursor-pointer transition duration-200 transform hover:scale-[1.02]">
        <img
          src={turfImg}
          alt="Turf Cover Image"
          width={495}
          height={185}
          className="object-cover w-full h-full"
          style={{ aspectRatio: "495/185", objectFit: "cover" }}
        />
        <div className="bg-white p-1 lg:p-2 flex flex-col gap-2">
          <h3 className="font-bold tracking-tight text-black text-xl">{playground.name}</h3>
          <small className="text-sm leading-none text-black">{playground.address}</small>
       
          <div className="flex items-center gap-2 text-black">
            
              {displayTurfs.map(turf => (
                <SportsIcon key={turf.id}  turf={turf}/>
              ))}

              {remainingCount > 0 && (
                <span className="text-sm text-muted-foreground">+{remainingCount}</span>
              )}  

          </div>
        </div>
      </div>
    </Card>
  )
}

function BanIcon(props:any) {
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
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  )
}


function BirdIcon(props:any) {
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
      <path d="M16 7h.01" />
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
      <path d="m20 7 2 .5-2 .5" />
      <path d="M10 18v3" />
      <path d="M14 17.75V21" />
      <path d="M7 18a6 6 0 0 0 3.84-10.61" />
    </svg>
  )
}


function ClubIcon(props:any) {
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
      <path d="M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z" />
      <path d="M12 17.66L12 22" />
    </svg>
  )
}