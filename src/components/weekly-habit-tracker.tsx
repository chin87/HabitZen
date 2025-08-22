'use client';

import * as React from 'react';
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
} from 'date-fns';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

type WeeklyHabitTrackerProps = {
  habits: Habit[];
  onToggleCompletion: (id: string, date: string) => void;
};

export default function WeeklyHabitTracker({
  habits,
  onToggleCompletion,
}: WeeklyHabitTrackerProps) {
  const [currentDate] = React.useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const truncateHabitName = (name: string, maxLength = 20) => {
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
                <th className="p-3 font-medium text-muted-foreground w-1/4">Habit</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="p-3 font-medium text-muted-foreground text-center">
                    <div className="flex flex-col items-center">
                        <span>{format(day, 'EEE')}</span>
                        <span className="text-xs">{format(day, 'd')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, habitIndex) => (
                <tr key={habit.id} className="border-b">
                  <td className="p-3 font-medium" title={habit.name}>
                    {truncateHabitName(habit.name)}
                    </td>
                  {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates.includes(dateStr);
                    const isFuture = day > new Date() && !isSameDay(day, new Date());

                    return (
                      <td key={dateStr} className="p-3 text-center">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => onToggleCompletion(habit.id, dateStr)}
                          disabled={isFuture}
                          aria-label={`Mark ${habit.name} for ${dateStr} as ${
                            isCompleted ? 'incomplete' : 'complete'
                          }`}
                        />
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
