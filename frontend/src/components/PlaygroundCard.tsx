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
  const displayTurfs = playground.turfs.slice(0, 2);
  const remainingCount = Math.max(playground.turfs.length - 1, 0);

  return (
    <Card className="w-full max-w-sm">
      <Link to={`/playground/${playground.name}/${playground.id}`}>
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
      </Link>
    </Card>
  )
}

