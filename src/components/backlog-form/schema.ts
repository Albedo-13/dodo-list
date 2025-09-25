import { z } from 'zod';

export const backlogFormSchema = z.object({
  task: z.string().min(2, 'More than 2 symbols').max(100, 'Less than 100 symbols'),
  type: z.string().min(2, 'More than 2 symbols').max(50, 'Less than 50 symbols'),
  statusId: z.string().min(1, 'Required field'),
  estimation: z.number().min(0, 'More than 0').max(1000, 'Less than 1000'),
  userId: z.number().nullable(),
});
