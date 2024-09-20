// components/TurfCard.tsx
import React from 'react';
import { FaFootballBall, FaBaseballBall } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';

interface Turf {
  turf: {
    id: string;
    name: string;
    type: 'FOOTBALL' | 'CRICKET' | 'BADMINTON';
    hourlyRate: number;
  };
}

const SportsIcon: React.FC<Turf> = ({ turf }) => {
  const getIcon = () => {
    switch (turf.type) {
      case 'FOOTBALL':
        return <FaFootballBall className="w-5 h-5" />;
      case 'CRICKET':
        return <FaBaseballBall className="w-5 h-5" />;
      case 'BADMINTON':
        return <GiTennisBall className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
      <div className="flex items-center">
        {getIcon()}
        {/* <span className="ml-2">{turf.name}</span> */}
      </div>
      {/* <span>₹{turf.hourlyRate}/hour</span> */}
    </div>
  );
};


export default SportsIcon;
