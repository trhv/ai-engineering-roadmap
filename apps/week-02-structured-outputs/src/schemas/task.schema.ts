import { z } from 'zod';

export const PriorityEnum = z.enum(['low', 'medium', 'high', 'urgent'], {
  description: 'Priority of the task based on urgency and business impact.',
});
export type Priority = z.infer<typeof PriorityEnum>;

export const TaskStatusEnum = z.enum(['draft', 'pending', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/;

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters')
    .describe('A concise, action-oriented title for the task'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .default('')
    .describe('Detailed summary of the objective, context, or requirements'),
  priority: PriorityEnum.default('medium').describe('Task urgency and impact level'),
  dueDate: z
    .string()
    .nullable()
    .refine(
      val => val === null || isoDateRegex.test(val),
      'dueDate must be a valid ISO 8601 date string (e.g. 2026-12-01 or 2026-12-01T17:00:00.000Z) or null'
    )
    .default(null)
    .describe('Target deadline in ISO 8601 format or null if unassigned'),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(30)
        .transform(t => t.toLowerCase().trim().replace(/[^a-z0-9_-]/g, ''))
    )
    .max(5, 'Maximum of 5 tags allowed')
    .default([])
    .describe('Categorization tags in lowercase'),
  estimatedHours: z
    .number()
    .positive('Estimated hours must be positive')
    .max(100, 'Estimated hours cannot exceed 100')
    .nullable()
    .default(null)
    .describe('Estimated effort in hours, or null if unspecified'),
});

export type ExtractedTask = z.infer<typeof TaskSchema>;

export const ExtractedTaskResponseSchema = z.object({
  task: TaskSchema,
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence score between 0.0 and 1.0 regarding extraction accuracy'),
  reasoning: z
    .string()
    .max(1000)
    .describe('Brief explanation of how values (especially priority and dueDate) were inferred'),
});

export type ExtractedTaskResponse = z.infer<typeof ExtractedTaskResponseSchema>;

export interface TaskRecord extends ExtractedTask {
  id: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
