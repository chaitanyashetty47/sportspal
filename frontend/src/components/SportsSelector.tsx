import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Sport {
  type: string;
}

interface SportsSelectorProps {
  onSportChange: (sport: string) => void;
}

export default function SportsSelector({ onSportChange }: SportsSelectorProps) {
  const [sport, setSport] = useState<string>('');
  const [sportsOptions, setSportsOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { playgroundId } = useParams();

  useEffect(() => {
    const fetchSportsOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/playgrounds/${playgroundId}/sports`);
        if (!response.ok) {
          throw new Error('Failed to fetch sports options');
        }
        const data: Sport[] = await response.json();
        
        const sportsData = data.map(sport => sport.type);
        setSportsOptions(sportsData);
        if (sportsData.length > 0) {
          setSport(sportsData[0]);
          onSportChange(sportsData[0]);
        }
      } catch (err) {
        setError('Failed to load sports options. Please try again later.');
        console.error('Error fetching sports options:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSportsOptions();
  }, [playgroundId, onSportChange]);

  const handleSportChange = useCallback((value: string) => {
    console.log("Selected value:", value);
    setSport(value);
    onSportChange(value);
  }, [onSportChange]);

  if (isLoading) return <div>Loading sports options...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Select value={sport} onValueChange={handleSportChange}>
      <SelectTrigger>
        <SelectValue>{sport}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sportsOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}