'use client';

import * as React from 'react';
import { addMonths, format, isSameMonth, startOfMonth, subMonths, isSaturday, isSunday } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';

type HabitCalendarProps = {
  habits: Habit[];
};

export default function HabitCalendar({ habits }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const months = [subMonths(currentDate, 2), subMonths(currentDate, 1), currentDate];

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

  const totalHabits = habits.length;

  const DayContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = completionsByDay.get(dateStr) || 0;
    const completionPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
    
    const getBackgroundColor = () => {
        if (completionPercentage === 0) return 'transparent';
        if (completionPercentage < 25) return 'bg-primary/20';
        if (completionPercentage < 50) return 'bg-primary/40';
        if (completionPercentage < 75) return 'bg-primary/60';
        if (completionPercentage < 100) return 'bg-primary/80';
        return 'bg-primary';
    }

    const isWeekend = isSaturday(date) || isSunday(date);

    return (
        <div className={cn("flex flex-col items-center justify-center w-full h-full rounded-md", isWeekend && "bg-secondary")}>
            <span>{format(date, 'd')}</span>
            <div className={cn("mt-1 w-4 h-4 rounded-sm flex items-center justify-center text-xs text-primary-foreground", getBackgroundColor())}>
                {completedCount > 0 && <span>{completedCount}</span>}
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      {months.map((month, index) => (
        <Calendar
          key={index}
          month={startOfMonth(month)}
          weekStartsOn={1}
          components={{ DayContent }}
          className="rounded-md border"
          classNames={{
            day_cell: 'h-12 w-16 text-sm p-0',
            day: 'h-full w-full p-1 rounded-md',
            head_cell: 'w-16'
          }}
        />
      ))}
    </div>
  );
}
