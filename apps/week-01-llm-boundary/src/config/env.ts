import { config } from "dotenv";
import { z } from "zod";

// Load .env if present
config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),
  DEFAULT_MODEL: z.string().default("gemini-2.5-flash"),
  BENCHMARK_MODEL_A: z.string().default("gemini-2.5-flash"),
  BENCHMARK_MODEL_B: z.string().default("gemini-2.5-pro"),
  REQUEST_TIMEOUT_MS: z.coerce.number().default(15000),
  MAX_TOKENS: z.coerce.number().default(2048),
});

export type Env = z.infer<typeof envSchema>;

let parsedEnv: Env;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    for (const issue of error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
  } else {
    console.error("❌ Failed to parse environment variables", error);
  }
  // Allow CLI or evaluation scripts to warn without hard-crashing if key is not yet set during setup
  parsedEnv = {
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: (process.env.NODE_ENV as any) || "development",
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    DEFAULT_MODEL: process.env.DEFAULT_MODEL || "gemini-2.5-flash",
    BENCHMARK_MODEL_A: process.env.BENCHMARK_MODEL_A || "gemini-2.5-flash",
    BENCHMARK_MODEL_B: process.env.BENCHMARK_MODEL_B || "gemini-2.5-pro",
    REQUEST_TIMEOUT_MS: Number(process.env.REQUEST_TIMEOUT_MS) || 15000,
    MAX_TOKENS: Number(process.env.MAX_TOKENS) || 2048,
  };
}

export const env = parsedEnv;
