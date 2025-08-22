'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, Sparkles } from 'lucide-react';

import { suggestHabits } from '@/ai/flows/suggest-habits';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Habit } from '@/types';

const formSchema = z.object({
  goals: z
    .string()
    .min(10, 'Please describe your goals in at least 10 characters.')
    .max(500),
});

type SuggestHabitsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
};

export default function SuggestHabitsDialog({
  open,
  onOpenChange,
  onHabitAdd,
}: SuggestHabitsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { goals: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestHabits({ goals: values.goals });
      setSuggestions(result.habits);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch habit suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddSuggestedHabit = (habitName: string) => {
    onHabitAdd({ name: habitName });
    toast({
      title: 'Habit Added!',
      description: `"${habitName}" has been added to your list.`,
    });
    const newSuggestions = suggestions.filter((s) => s !== habitName);
    setSuggestions(newSuggestions);
    if (newSuggestions.length === 0) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get AI Habit Suggestions</DialogTitle>
          <DialogDescription>
            Describe your health and life goals, and we'll suggest some habits to help you get there.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>My Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I want to improve my sleep, reduce stress, and have more energy."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? 'Thinking...' : 'Get Suggestions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        {(loading || suggestions.length > 0) && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Suggestions</h4>
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
            {suggestions.map((habit, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-2"
              >
                <p className="text-sm">{habit}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddSuggestedHabit(habit)}
                  aria-label={`Add ${habit} habit`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
