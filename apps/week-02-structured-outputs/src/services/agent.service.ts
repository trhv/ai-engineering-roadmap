import { generateText } from 'ai';
import { getModel } from './llm.service.js';
import { ToolExecutorService } from './tool-executor.service.js';
import { env } from '../config/env.js';
import { logger } from './logger.service.js';

export interface AgentStepRecord {
  stepType: string;
  toolCalls?: Array<{
    toolName: string;
    args: unknown;
  }>;
  text?: string;
}

export interface AgentResponse {
  answer: string;
  toolCallsCount: number;
  steps: AgentStepRecord[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AgentService {
  public static async executePrompt(
    prompt: string,
    modelName: string = env.DEFAULT_MODEL
  ): Promise<AgentResponse> {
    logger.info({ modelName, prompt }, 'Agent executing user prompt');
    const model = getModel(modelName);

    const systemPrompt = `You are an autonomous engineering task assistant. You have access to authorized workspace tools:
- searchTasks: Search existing tasks in the workspace by query, priority, tag, status.
- createDraftTask: Create a new draft task with title, description, priority, dueDate, tags, estimatedHours.

Guiding Principles:
1. Always check existing tasks first before creating duplicate tasks if the user asks you to look up or manage tasks.
2. If the user asks to create or log a task, use createDraftTask with carefully extracted fields.
3. If an operation is rejected by the system or violates security policies, explain the limitation clearly and politely to the user.
4. Assume today's date is 2026-11-24 when computing relative dates.`;

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt,
      tools: ToolExecutorService.getApplicationTools(),
      maxSteps: env.MAX_TOOL_STEPS,
      abortSignal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
    });

    const steps: AgentStepRecord[] = result.steps.map(s => ({
      stepType: s.stepType,
      toolCalls: s.toolCalls?.map(tc => ({
        toolName: tc.toolName,
        args: tc.args,
      })),
      text: s.text,
    }));

    const toolCallsCount = result.steps.reduce(
      (acc, s) => acc + (s.toolCalls ? s.toolCalls.length : 0),
      0
    );

    return {
      answer: result.text,
      toolCallsCount,
      steps,
      usage: {
        promptTokens: result.usage?.promptTokens ?? 0,
        completionTokens: result.usage?.completionTokens ?? 0,
        totalTokens: result.usage?.totalTokens ?? 0,
      },
    };
  }
}
