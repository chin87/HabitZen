'use client';

import * as React from 'react';
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
  isWithinInterval,
  endOfWeek,
} from 'date-fns';
import { Check } from 'lucide-react';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from './ui/progress';

type WeeklyHabitTrackerProps = {
  habits: Habit[];
};

export default function WeeklyHabitTracker({
  habits
}: WeeklyHabitTrackerProps) {
  const [currentDate] = React.useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const { totalCompleted, totalPossible, percentage } = React.useMemo(() => {
    if (habits.length === 0) {
      return { totalCompleted: 0, totalPossible: 0, percentage: 0 };
    }
    
    let completedInWeek = 0;
    let possibleInWeek = 0;

    habits.forEach(habit => {
      const habitCreatedDate = new Date(habit.createdAt);
      weekDays.forEach(day => {
        if (habitCreatedDate <= day) {
          possibleInWeek++;
          const dateStr = format(day, 'yyyy-MM-dd');
          if (habit.completedDates.includes(dateStr)) {
            completedInWeek++;
          }
        }
      });
    });

    const percentage = possibleInWeek > 0 ? (completedInWeek / possibleInWeek) * 100 : 0;
    return { totalCompleted: completedInWeek, totalPossible: possibleInWeek, percentage };
  }, [habits, weekDays]);

  const truncateHabitName = (name: string, maxLength = 15) => {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="w-full mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-muted-foreground">Weekly Score</span>
                <span className="text-sm font-bold text-foreground">{`${totalCompleted} / ${totalPossible}`}</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-2 font-medium text-muted-foreground w-2/5">Habit</th>
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
                    const isHabitActive = new Date(habit.createdAt) <= day;
                    
                    return (
                      <td key={dateStr} className="p-2 text-center">
                        <div className="flex justify-center items-center h-5 w-5 mx-auto">
                          {isHabitActive ? (
                            isCompleted ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-secondary" />
                            )
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
               {habits.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-muted-foreground">No habits for this week.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
