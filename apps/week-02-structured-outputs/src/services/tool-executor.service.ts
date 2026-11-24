import { tool } from 'ai';
import { z } from 'zod';
import { SearchTasksArgsSchema, CreateDraftTaskArgsSchema } from '../schemas/tools.schema.js';
import { taskStore } from '../storage/in-memory-task.store.js';
import { SecurityViolationError, ToolExecutionError } from '../errors/app-errors.js';
import { logger } from './logger.service.js';

// Suspicious patterns (SQL injection, shell execution, arbitrary protocol fetching)
const DANGEROUS_PATTERNS = [
  /(\bDROP\s+TABLE\b|\bDELETE\s+FROM\b|\bUNION\s+SELECT\b|;\s*--)/i,
  /(\brm\s+-rf\b|\bcat\s+\/etc\/|\/bin\/sh|\/bin\/bash|\bcurl\s+http|\bwget\s+http)/i,
  /(<script\b|javascript:|<iframe\b)/i,
  /(\bSELECT\s+\*\s+FROM\b|\bINSERT\s+INTO\b)/i,
];

function sanitizeStringInput(val: string, fieldName: string): void {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(val)) {
      logger.warn({ fieldName, pattern: pattern.toString(), val }, 'Security violation attempt detected and blocked');
      throw new SecurityViolationError(`Security policy violation: prohibited pattern detected in parameter '${fieldName}'.`);
    }
  }
}

export class ToolExecutorService {
  public static executeSearchTasks(rawArgs: unknown) {
    logger.info({ rawArgs }, 'Executing tool: searchTasks');
    const parseResult = SearchTasksArgsSchema.safeParse(rawArgs);
    if (!parseResult.success) {
      throw new ToolExecutionError('Invalid arguments for searchTasks', parseResult.error.format());
    }

    const { query, priority, tag, status, limit } = parseResult.data;
    if (query) sanitizeStringInput(query, 'query');
    if (tag) sanitizeStringInput(tag, 'tag');

    const tasks = taskStore.search({ query, priority, tag, status, limit });
    return {
      success: true,
      count: tasks.length,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate,
        tags: t.tags,
      })),
    };
  }

  public static executeCreateDraftTask(rawArgs: unknown) {
    logger.info({ rawArgs }, 'Executing tool: createDraftTask');
    const parseResult = CreateDraftTaskArgsSchema.safeParse(rawArgs);
    if (!parseResult.success) {
      throw new ToolExecutionError('Invalid arguments for createDraftTask', parseResult.error.format());
    }

    const taskData = parseResult.data;
    sanitizeStringInput(taskData.title, 'title');
    sanitizeStringInput(taskData.description, 'description');
    for (const tag of taskData.tags) {
      sanitizeStringInput(tag, 'tag');
    }

    const created = taskStore.createDraft({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
      estimatedHours: taskData.estimatedHours,
    });

    return {
      success: true,
      message: `Draft task successfully created with ID ${created.id}`,
      task: created,
    };
  }

  /**
   * Return application-governed tools ready to be passed to Vercel AI SDK generateText / streamText.
   */
  public static getApplicationTools() {
    return {
      searchTasks: tool({
        description: 'Search existing workspace tasks by keyword query, priority, tag, or lifecycle status.',
        parameters: SearchTasksArgsSchema,
        execute: async (args) => {
          return ToolExecutorService.executeSearchTasks(args);
        },
      }),

      createDraftTask: tool({
        description: 'Create a new draft task in the project workspace with validated fields (title, description, priority, dueDate, tags).',
        parameters: CreateDraftTaskArgsSchema,
        execute: async (args) => {
          return ToolExecutorService.executeCreateDraftTask(args);
        },
      }),
    };
  }
}
