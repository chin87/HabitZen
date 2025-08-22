'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Habit } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, 'Habit name must be at least 2 characters.').max(50),
  description: z.string().max(200).optional(),
});

type AddHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
};

export default function AddHabitDialog({ open, onOpenChange, onHabitAdd }: AddHabitDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onHabitAdd(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Habit</DialogTitle>
          <DialogDescription>
            What new routine would you like to build?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habit Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Read for 15 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Before bed, no phone"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Habit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
