// components/TurfCard.tsx
import React from 'react';
import { FaFootballBall, FaBaseballBall } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { Turf , TurfType} from '@/types/interface';

interface SportsCardProps{
  turf:Turf;
}

const SportsCard: React.FC<SportsCardProps> = ({ turf }) => {
  const getIcon = () => {
    switch (turf.type) {
      case TurfType.FOOTBALL:
        return <FaFootballBall className="w-5 h-5" />;
      case TurfType.CRICKET:
        return <FaBaseballBall className="w-5 h-5" />; 
      case TurfType.BADMINTON:
        return  <GiTennisBall className="w-5 h-5" />;
           
         
      default:
        return null;
    }
  };

  return (
          <div className="flex flex-col items-center py-1 border rounded shadow-md cursor-pointer hover:border-primary hover:border aspect-square border-border_color">
              <span className="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;">
              {getIcon()}
              </span>
              <h3 className="flex justify-center w-full mt-1 text-xs font-medium text-center text-border_tag">Badminton</h3> 
          </div>    
       
  );
};


export default SportsCard;
