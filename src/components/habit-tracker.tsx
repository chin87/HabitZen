'use client';

import * as React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import useHabits from '@/lib/hooks/use-habits';
import AddHabitDialog from './add-habit-dialog';
import SuggestHabitsDialog from './suggest-habits-dialog';
import HabitItem from './habit-item';
import HabitCalendar from './habit-calendar';
import WeeklyHabitTracker from './weekly-habit-tracker';
import { Button } from './ui/button';
import { LeafIcon } from './icons';
import { Separator } from './ui/separator';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [suggestDialogOpen, setSuggestDialogOpen] = React.useState(false);

  return (
    <>
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <LeafIcon className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-foreground">
              HabitZen
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setSuggestDialogOpen(true)} variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Suggest Habits
            </Button>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Habit
            </Button>
          </div>
        </header>

        <section className="mb-8">
          {habits.length > 0 ? (
            <div className="space-y-4">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggleCompletion={toggleHabitCompletion}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
              <h3 className="font-headline text-xl font-semibold">
                Your habit list is empty!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Click "New Habit" to start building a new routine.
              </p>
              <Button onClick={() => setAddDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add First Habit
              </Button>
            </div>
          )}
        </section>
        
        <Separator className="my-8" />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-center mb-4 font-headline">Weekly Progress</h2>
            <WeeklyHabitTracker habits={habits} onToggleCompletion={toggleHabitCompletion} />
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-center mb-4 font-headline">Monthly Progress</h2>
            <div className="flex justify-center">
              <HabitCalendar habits={habits} />
            </div>
          </div>
        </section>
      </div>

      <AddHabitDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onHabitAdd={addHabit}
      />
      <SuggestHabitsDialog
        open={suggestDialogOpen}
        onOpenChange={setSuggestDialogOpen}
        onHabitAdd={addHabit}
      />
    </>
  );
}
