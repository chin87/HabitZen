'use client';

import * as React from 'react';
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
} from 'date-fns';
import { Check } from 'lucide-react';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

type WeeklyHabitTrackerProps = {
  habits: Habit[];
};

export default function WeeklyHabitTracker({
  habits
}: WeeklyHabitTrackerProps) {
  const [currentDate] = React.useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const truncateHabitName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 font-medium text-muted-foreground w-1/3">Habit</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="p-2 font-medium text-muted-foreground text-center">
                    <div className="flex flex-col items-center text-xs">
                        <span>{format(day, 'EEE')}</span>
                        <span className="font-normal">{format(day, 'd')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-b">
                  <td className="p-2 font-medium text-xs" title={habit.name}>
                    {truncateHabitName(habit.name)}
                    </td>
                  {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates.includes(dateStr);
                    
                    return (
                      <td key={dateStr} className="p-2 text-center">
                        <div className="flex justify-center items-center h-5 w-5 mx-auto">
                          {isCompleted ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
