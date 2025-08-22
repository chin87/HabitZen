'use client';

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '@/types';
import { useToast } from '@/hooks/use-toast';

const HABITS_STORAGE_KEY = 'habit-zen-data';

export default function useHabits() {
  const { toast } = useToast();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Loading Error',
        description: 'Could not load your saved habits.',
      });
    } finally {
        setIsLoaded(true);
    }
  }, [toast]);

  React.useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Saving Error',
          description: 'Could not save your habit changes.',
        });
      }
    }
  }, [habits, isLoaded, toast]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => {
    const habitToAdd: Habit = {
      ...newHabit,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits((prev) => [habitToAdd, ...prev]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const completedDates = habit.completedDates.includes(date)
            ? habit.completedDates.filter((d) => d !== date)
            : [...habit.completedDates, date];
          
          completedDates.sort();

          return { ...habit, completedDates };
        }
        return habit;
      })
    );
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
  };
}
