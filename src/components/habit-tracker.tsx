'use client';

import * as React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import useHabits from '@/lib/hooks/use-habits';
import AddHabitDialog from './add-habit-dialog';
import SuggestHabitsDialog from './suggest-habits-dialog';
import HabitItem from './habit-item';
import { Button } from './ui/button';
import { LeafIcon } from './icons';

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitCompletion } = useHabits();
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [suggestDialogOpen, setSuggestDialogOpen] = React.useState(false);

  return (
    <>
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
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

        <section>
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
