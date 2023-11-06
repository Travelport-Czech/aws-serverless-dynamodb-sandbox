import { z } from 'zod';

export const taskDatabaseSchema = z.strictObject({
  type: z.literal('Task'),
  id: z.string(),
  created: z.string(),
  attributes: z.strictObject({
    description: z.string(),
  }),
});

export type TaskDatabase = z.infer<typeof taskDatabaseSchema>;
