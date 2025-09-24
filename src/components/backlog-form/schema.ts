import { z } from 'zod';

export const backlogFormSchema = z.object({
  task: z.string().min(2).max(100),
  type: z.string().min(2).max(50),
  statusId: z.string(),
  estimation: z.number().min(0).max(1000),
  userId: z.number().nullable(),
});
