'use client';

import * as React from 'react';
import { Flame, MoreHorizontal, Trash2 } from 'lucide-react';
import { format, isToday } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { calculateStreak } from '@/lib/utils';
import type { Habit } from '@/types';

type HabitItemProps = {
  habit: Habit;
  onToggleCompletion: (id: string, date: string) => void;
  onDelete: (id: string) => void;
};

export default function HabitItem({ habit, onToggleCompletion, onDelete }: HabitItemProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completedDates.includes(todayStr);
  const streak = calculateStreak(habit.completedDates);

  return (
    <Card
      className={`transition-all duration-300 ${
        isCompletedToday ? 'bg-secondary' : 'bg-card'
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-xl">{habit.name}</CardTitle>
          {habit.description && (
            <CardDescription>{habit.description}</CardDescription>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(habit.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`habit-${habit.id}`}
            checked={isCompletedToday}
            onCheckedChange={() => onToggleCompletion(habit.id, todayStr)}
            className="h-6 w-6"
            aria-label={`Mark ${habit.name} as complete`}
          />
          <label
            htmlFor={`habit-${habit.id}`}
            className="cursor-pointer text-sm font-medium leading-none"
          >
            {isCompletedToday ? 'Completed Today!' : 'Mark as Complete'}
          </label>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary-foreground">
            <Flame className={`h-5 w-5 ${
                isCompletedToday || isToday(new Date(habit.completedDates[habit.completedDates.length-1] + 'T12:00:00')) ? 'text-orange-500' : 'text-muted-foreground'
              }`} />
            <span className="text-primary">{streak} Day Streak</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
