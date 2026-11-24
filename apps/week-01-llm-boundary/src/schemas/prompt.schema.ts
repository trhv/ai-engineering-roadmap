import { z } from "zod";

export const generateRequestSchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .trim()
    .min(1, "Prompt cannot be empty")
    .max(8000, "Prompt cannot exceed 8000 characters"),
  systemPrompt: z
    .string()
    .trim()
    .max(4000, "System prompt cannot exceed 4000 characters")
    .optional(),
  model: z
    .string()
    .trim()
    .min(1, "Model name cannot be empty")
    .optional(),
  temperature: z
    .number()
    .min(0.0, "Temperature must be at least 0.0")
    .max(2.0, "Temperature cannot exceed 2.0")
    .optional(),
  maxTokens: z
    .number()
    .int()
    .positive("maxTokens must be greater than 0")
    .max(8192, "maxTokens cannot exceed 8192")
    .optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const generateResponseSchema = z.object({
  requestId: z.string().uuid(),
  model: z.string(),
  content: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
  latencyMs: z.number(),
  finishReason: z.string(),
});

export type GenerateResponse = z.infer<typeof generateResponseSchema>;
