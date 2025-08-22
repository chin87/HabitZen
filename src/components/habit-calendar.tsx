'use client';

import * as React from 'react';
import { format, isSameMonth, startOfMonth } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import type { Habit } from '@/types';
import { cn } from '@/lib/utils';

type HabitCalendarProps = {
  habits: Habit[];
};

export default function HabitCalendar({ habits }: HabitCalendarProps) {
  const [month, setMonth] = React.useState(startOfMonth(new Date()));

  const completionsByDay = React.useMemo(() => {
    const completions = new Map<string, number>();
    habits.forEach((habit) => {
      habit.completedDates.forEach((dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        if (isSameMonth(date, month)) {
          const dayStr = format(date, 'yyyy-MM-dd');
          completions.set(dayStr, (completions.get(dayStr) || 0) + 1);
        }
      });
    });
    return completions;
  }, [habits, month]);

  const totalHabits = habits.length;

  const DayContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedCount = completionsByDay.get(dateStr) || 0;

    if (totalHabits === 0) {
      return (
        <div className="relative flex h-full w-full items-center justify-center">
          <span className="text-xs text-muted-foreground">{format(date, 'd')}</span>
        </div>
      );
    }
    
    const allCompleted = completedCount > 0 && completedCount === totalHabits;

    return (
      <div className={cn("relative flex h-full w-full items-center justify-center rounded-md", 
        completedCount > 0 && "bg-secondary",
        allCompleted && "bg-primary/80 text-primary-foreground"
      )}>
        <span className="text-xs">
          {completedCount > 0
            ? `${completedCount}/${totalHabits}`
            : format(date, 'd')}
        </span>
      </div>
    );
  };

  return (
    <Calendar
      month={month}
      onMonthChange={setMonth}
      components={{
        DayContent: DayContent,
      }}
      className="rounded-md border"
      classNames={{
        day_cell: 'h-12 w-16 text-sm p-0',
        day: 'h-full w-full p-1 rounded-md',
      }}
    />
  );
}
