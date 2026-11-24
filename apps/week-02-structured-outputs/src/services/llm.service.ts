import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '../config/env.js';

export const googleProvider = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export function getModel(modelName: string = env.DEFAULT_MODEL) {
  return googleProvider(modelName);
}
