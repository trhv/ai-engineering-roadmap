import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { env } from "../config/env.js";
import { normalizeError, AppError } from "../errors/app-error.js";
import { GenerateRequest, GenerateResponse } from "../schemas/prompt.schema.js";
import { createRequestLogger } from "./logger.service.js";

export class LlmService {
  private googleProvider: ReturnType<typeof createGoogleGenerativeAI>;

  constructor(apiKey?: string) {
    const key = apiKey || env.GOOGLE_GENERATIVE_AI_API_KEY;
    this.googleProvider = createGoogleGenerativeAI({
      apiKey: key,
    });
  }

  /**
   * Executes a prompt against Google Gemini via the Vercel AI SDK
   * within strict application boundaries (timeout, normalization, observability).
   */
  async generate(
    params: GenerateRequest,
    requestId: string
  ): Promise<GenerateResponse> {
    const log = createRequestLogger(requestId);
    const chosenModel = params.model || env.DEFAULT_MODEL;
    const timeoutMs = env.REQUEST_TIMEOUT_MS;

    log.info(
      {
        model: chosenModel,
        promptLength: params.prompt.length,
        hasSystemPrompt: Boolean(params.systemPrompt),
        timeoutMs,
      },
      "Initiating LLM generation"
    );

    const startTime = performance.now();
    const abortController = new AbortController();
    const timer = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    try {
      const modelInstance = this.googleProvider(chosenModel);

      const result = await generateText({
        model: modelInstance,
        prompt: params.prompt,
        system: params.systemPrompt,
        temperature: params.temperature ?? 0.7,
        maxTokens: params.maxTokens ?? env.MAX_TOKENS,
        abortSignal: abortController.signal,
      });

      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - startTime);

      const promptTokens = result.usage?.promptTokens ?? 0;
      const completionTokens = result.usage?.completionTokens ?? 0;
      const totalTokens = result.usage?.totalTokens ?? promptTokens + completionTokens;

      const response: GenerateResponse = {
        requestId,
        model: chosenModel,
        content: result.text,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
        },
        latencyMs,
        finishReason: result.finishReason ?? "stop",
      };

      log.info(
        {
          model: chosenModel,
          latencyMs,
          usage: response.usage,
          finishReason: response.finishReason,
          status: "SUCCESS",
        },
        "LLM generation succeeded"
      );

      return response;
    } catch (rawError: unknown) {
      clearTimeout(timer);
      const latencyMs = Math.round(performance.now() - startTime);
      const normalizedError = normalizeError(rawError);

      log.error(
        {
          model: chosenModel,
          latencyMs,
          errorCode: normalizedError.code,
          errorMessage: normalizedError.message,
          status: "FAILED",
        },
        "LLM generation failed"
      );

      throw normalizedError;
    }
  }
}

export const llmService = new LlmService();
