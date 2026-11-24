import { generateObject, generateText } from 'ai';
import { getModel } from './llm.service.js';
import { ExtractedTaskResponseSchema, ExtractedTaskResponse } from '../schemas/task.schema.js';
import { TaskExtractionError } from '../errors/app-errors.js';
import { logger } from './logger.service.js';
import { env } from '../config/env.js';

export class TaskExtractorService {
  /**
   * Extracts a structured, validated task from raw natural language input.
   */
  public static async extractFromText(
    inputText: string,
    modelName: string = env.DEFAULT_MODEL
  ): Promise<ExtractedTaskResponse> {
    const trimmed = inputText?.trim() ?? '';
    if (trimmed.length < 3) {
      throw new TaskExtractionError('Input text is too short or empty to extract a meaningful task');
    }

    logger.info({ modelName, inputLength: trimmed.length }, 'Extracting task from unstructured text');

    try {
      const model = getModel(modelName);

      const systemPrompt = `You are an expert project management assistant specialized in extracting structured task specifications from unstructured communications (notes, emails, slack messages, transcripts).
Rules:
1. Identify a clear, action-oriented title (3-100 chars).
2. Summarize key requirements and context in description (up to 500 chars).
3. Infer priority ('low' | 'medium' | 'high' | 'urgent'). If not explicitly stated, default to 'medium' unless words like 'ASAP', 'blocking', 'production down', 'critical' imply 'urgent' or 'high'.
4. Convert any mentioned deadline to an ISO 8601 date string (e.g. '2026-12-01' or '2026-12-01T17:00:00.000Z'). If no deadline is mentioned, return null. Assume today is 2026-11-24.
5. Extract up to 5 lowercase tags (e.g., ['backend', 'bug']).
6. Estimate duration in hours if mentioned, else return null.
7. Provide a confidence score between 0.0 and 1.0 and a brief explanation in reasoning.`;

      const result = await generateObject({
        model,
        schema: ExtractedTaskResponseSchema,
        system: systemPrompt,
        prompt: `Extract structured task information from the following input:\n\n"""\n${trimmed}\n"""`,
        abortSignal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
      });

      // Semantic validation: Ensure title is not just punctuation/gibberish
      const extracted = result.object;
      if (extracted.task.title.replace(/[^a-zA-Z0-9]/g, '').length < 2) {
        throw new TaskExtractionError('Extracted task title contains insufficient alphanumeric content');
      }

      return extracted;
    } catch (err: unknown) {
      if (err instanceof TaskExtractionError) {
        throw err;
      }
      logger.error({ err }, 'Error during structured task extraction');
      throw new TaskExtractionError(
        `Failed to extract structured task: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
}
