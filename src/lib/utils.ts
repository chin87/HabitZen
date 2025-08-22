import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, isSameDay, subDays, format, isToday, isYesterday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) {
    return 0;
  }

  const sortedDates = completedDates.map(dateStr => new Date(dateStr + 'T00:00:00')).sort((a, b) => b.getTime() - a.getTime());

  let lastDate = sortedDates[0];
  
  if (!isToday(lastDate) && !isYesterday(lastDate)) {
    return 0;
  }
  
  let streak = 0;
  if(isToday(lastDate) || isYesterday(lastDate)) {
      streak = 1;
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const expectedPreviousDate = subDays(lastDate, 1);
    
    if (isSameDay(currentDate, expectedPreviousDate)) {
      streak++;
      lastDate = currentDate;
    } else {
      break; 
    }
  }

  return streak;
}
