export type Habit = {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO string
  completedDates: string[]; // 'YYYY-MM-DD'
};
