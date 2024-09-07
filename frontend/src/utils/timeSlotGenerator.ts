
export function generateTimeSlots(startTime: string, endTime: string, interval: number = 30): string[] {
  const timeSlots: string[] = [];
  let currentTime = new Date(`2000-01-01T${startTime}`);
  const endDateTime = new Date(`2000-01-01T${endTime}`);

  endDateTime.setHours(endDateTime.getHours() - 1, 0, 0, 0);

  while (currentTime <= endDateTime) {
    timeSlots.push(currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    currentTime.setMinutes(currentTime.getMinutes() + interval);
  }

  return timeSlots;
}