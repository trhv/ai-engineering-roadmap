import { z } from 'zod';
import { PriorityEnum, TaskStatusEnum } from './task.schema.js';

export const SearchTasksArgsSchema = z.object({
  query: z
    .string()
    .max(100, 'Search query cannot exceed 100 characters')
    .optional()
    .describe('Substring keyword match against task title or description'),
  priority: PriorityEnum.optional().describe('Filter by specific task priority'),
  tag: z.string().max(100).optional().describe('Filter by specific tag'),
  status: TaskStatusEnum.optional().describe('Filter by task lifecycle status'),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20, 'Search limit cannot exceed 20 items')
    .default(10)
    .describe('Maximum number of tasks to return'),
});

export type SearchTasksArgs = z.infer<typeof SearchTasksArgsSchema>;

export const CreateDraftTaskArgsSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters')
    .describe('A concise, action-oriented title for the task'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .default('')
    .describe('Detailed summary of the task objective and requirements'),
  priority: PriorityEnum.default('medium').describe('Task urgency level'),
  dueDate: z
    .string()
    .nullable()
    .default(null)
    .describe('Target deadline in ISO 8601 format (e.g. 2026-12-01) or null'),
  tags: z
    .array(z.string().min(1).max(30))
    .max(5)
    .default([])
    .describe('Categorization tags'),
  estimatedHours: z
    .number()
    .positive()
    .max(100)
    .nullable()
    .default(null)
    .describe('Estimated duration in hours'),
});

export type CreateDraftTaskArgs = z.infer<typeof CreateDraftTaskArgsSchema>;
