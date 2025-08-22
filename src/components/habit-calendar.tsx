'use client';

import * as React from 'react';
import {
  format,
  isSameMonth,
  startOfMonth,
  isSaturday,
  isSunday,
  getDaysInMonth,
  endOfMonth,
} from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

type HabitCalendarProps = {
  habits: Habit[];
};

export default function HabitCalendar({ habits }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const completionsByDay = React.useMemo(() => {
    const completions = new Map<string, number>();
    habits.forEach((habit) => {
      habit.completedDates.forEach((dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        const dayStr = format(date, 'yyyy-MM-dd');
        completions.set(dayStr, (completions.get(dayStr) || 0) + 1);
      });
    });
    return completions;
  }, [habits]);

  const { totalCompleted, totalPossible, percentage } = React.useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);

    if (habits.length === 0) {
      return { totalCompleted: 0, totalPossible: 0, percentage: 0 };
    }
    
    let completedInMonth = 0;
    completionsByDay.forEach((count, dayStr) => {
        const date = new Date(dayStr + 'T00:00:00');
        if (isSameMonth(date, currentDate)) {
            completedInMonth += count;
        }
    });

    const habitsActiveThisMonth = habits.filter(h => new Date(h.createdAt) <= monthEnd);
    
    let possibleInMonth = 0;
    habitsActiveThisMonth.forEach(h => {
        const habitCreatedDate = new Date(h.createdAt);
        if (habitCreatedDate > monthEnd) return;
        
        const start = habitCreatedDate > monthStart ? habitCreatedDate : monthStart;
        
        // +1 because difference is exclusive of the last day
        const daysActive = monthEnd.getDate() - start.getDate() + 1;
        possibleInMonth += daysActive;
    })


    const percentage = possibleInMonth > 0 ? (completedInMonth / possibleInMonth) * 100 : 0;

    return { totalCompleted: completedInMonth, totalPossible: possibleInMonth, percentage };
  }, [currentDate, habits, completionsByDay]);

  const totalHabits = habits.length;

  const DayContent = ({ date }: { date: Date }) => {
    if (!isSameMonth(date, currentDate)) {
        return <div className="flex flex-col items-center justify-center w-full h-full rounded-md" />;
    }
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = completionsByDay.get(dateStr) || 0;
    const habitsActiveOnDay = habits.filter(h => new Date(h.createdAt) <= date).length;
    const completionPercentage =
      habitsActiveOnDay > 0 ? (completedCount / habitsActiveOnDay) * 100 : 0;

    const getBackgroundColor = () => {
      if (completionPercentage === 0) return 'transparent';
      if (completionPercentage < 25) return 'bg-primary/20';
      if (completionPercentage < 50) return 'bg-primary/40';
      if (completionPercentage < 75) return 'bg-primary/60';
      if (completionPercentage < 100) return 'bg-primary/80';
      return 'bg-primary';
    };

    const isWeekend = isSaturday(date) || isSunday(date);

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center w-full h-full rounded-md',
          isWeekend && 'bg-secondary'
        )}
      >
        <span>{format(date, 'd')}</span>
        <div
          className={cn(
            'mt-1 w-full h-4 rounded-sm flex items-center justify-center text-xs text-primary-foreground',
            getBackgroundColor()
          )}
        >
          {habitsActiveOnDay > 0 && <span>{`${completedCount}/${habitsActiveOnDay}`}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-muted-foreground">Monthly Score</span>
                <span className="text-sm font-bold text-foreground">{`${totalCompleted} / ${totalPossible}`}</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
      <Calendar
        month={startOfMonth(currentDate)}
        onMonthChange={setCurrentDate}
        weekStartsOn={1}
        components={{ DayContent }}
        className="rounded-md border p-0"
        classNames={{
          day_cell: 'h-16 w-16 text-sm p-0',
          day: 'h-full w-full p-1 rounded-md',
          head_cell: 'w-16',
          table: 'w-full border-collapse',
          caption: "flex justify-between items-center px-4 py-2",
          nav_button: "h-8 w-8",
          months: "w-full",
          month: "w-full space-y-2",
        }}
      />
    </div>
  );
}
