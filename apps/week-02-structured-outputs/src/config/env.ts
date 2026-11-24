import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3002),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, 'GOOGLE_GENERATIVE_AI_API_KEY is required'),
  DEFAULT_MODEL: z.string().default('gemini-2.5-flash'),
  BENCHMARK_MODEL: z.string().default('gemini-2.5-pro'),
  REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),
  MAX_TOOL_STEPS: z.coerce.number().default(5),
  MAX_SEARCH_LIMIT: z.coerce.number().default(20),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

function parseEnv(): EnvConfig {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new Error(`Invalid environment configuration: ${errorDetails}`);
  }
  return result.data;
}

export const env = parseEnv();
