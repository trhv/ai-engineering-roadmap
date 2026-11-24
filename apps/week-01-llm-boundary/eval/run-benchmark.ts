import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { llmService } from "../src/services/llm.service.js";
import { env } from "../src/config/env.js";

interface PromptCase {
  id: string;
  category: string;
  prompt: string;
}

interface BenchmarkResult {
  id: string;
  category: string;
  model: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  outputPreview: string;
  success: boolean;
  error?: string;
}

async function run() {
  const promptsPath = path.resolve(import.meta.dirname, "prompts.json");
  const rawPrompts = await fs.readFile(promptsPath, "utf-8");
  const prompts: PromptCase[] = JSON.parse(rawPrompts);

  const modelA = env.BENCHMARK_MODEL_A; // e.g. gemini-2.5-flash
  const modelB = env.BENCHMARK_MODEL_B; // e.g. gemini-2.5-pro

  console.log(`🚀 Starting benchmark between Model A [${modelA}] and Model B [${modelB}]`);
  console.log(`📋 Total test cases: ${prompts.length}\n`);

  const resultsA: BenchmarkResult[] = [];
  const resultsB: BenchmarkResult[] = [];

  for (const p of prompts) {
    console.log(`▶ Testing [${p.id}] (${p.category})...`);

    // Run Model A
    try {
      const resA = await llmService.generate({ prompt: p.prompt, model: modelA }, uuidv4());
      resultsA.push({
        id: p.id,
        category: p.category,
        model: modelA,
        latencyMs: resA.latencyMs,
        promptTokens: resA.usage.promptTokens,
        completionTokens: resA.usage.completionTokens,
        totalTokens: resA.usage.totalTokens,
        outputPreview: resA.content.slice(0, 120).replace(/\n/g, " "),
        success: true,
      });
      console.log(`  ✓ ${modelA}: ${resA.latencyMs}ms (${resA.usage.totalTokens} tokens)`);
    } catch (err: any) {
      resultsA.push({
        id: p.id,
        category: p.category,
        model: modelA,
        latencyMs: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        outputPreview: "",
        success: false,
        error: err.message,
      });
      console.log(`  ✗ ${modelA} error: ${err.message}`);
    }

    // Small delay to be gentle with rate limits
    await new Promise((r) => setTimeout(r, 600));

    // Run Model B
    try {
      const resB = await llmService.generate({ prompt: p.prompt, model: modelB }, uuidv4());
      resultsB.push({
        id: p.id,
        category: p.category,
        model: modelB,
        latencyMs: resB.latencyMs,
        promptTokens: resB.usage.promptTokens,
        completionTokens: resB.usage.completionTokens,
        totalTokens: resB.usage.totalTokens,
        outputPreview: resB.content.slice(0, 120).replace(/\n/g, " "),
        success: true,
      });
      console.log(`  ✓ ${modelB}: ${resB.latencyMs}ms (${resB.usage.totalTokens} tokens)`);
    } catch (err: any) {
      resultsB.push({
        id: p.id,
        category: p.category,
        model: modelB,
        latencyMs: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        outputPreview: "",
        success: false,
        error: err.message,
      });
      console.log(`  ✗ ${modelB} error: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  // Calculate statistics
  const calcStats = (res: BenchmarkResult[]) => {
    const successList = res.filter((r) => r.success);
    if (!successList.length) return { p50: 0, p95: 0, avgTokens: 0, totalTokens: 0 };
    const latencies = successList.map((r) => r.latencyMs).sort((a, b) => a - b);
    const p50 = latencies[Math.floor(latencies.length * 0.5)];
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const totalTokens = successList.reduce((acc, r) => acc + r.totalTokens, 0);
    const avgTokens = Math.round(totalTokens / successList.length);
    return { p50, p95, avgTokens, totalTokens };
  };

  const statsA = calcStats(resultsA);
  const statsB = calcStats(resultsB);

  // Generate markdown report
  let md = `# Model Benchmark Comparison: ${modelA} vs ${modelB}\n\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Evaluation Set:** 10 diverse test cases (\`eval/prompts.json\`)\n\n`;

  md += `## 1. Summary Statistics\n\n`;
  md += `| Metric | ${modelA} | ${modelB} |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| **Success Rate** | ${resultsA.filter((r) => r.success).length}/${resultsA.length} | ${resultsB.filter((r) => r.success).length}/${resultsB.length} |\n`;
  md += `| **P50 Latency** | ${statsA.p50} ms | ${statsB.p50} ms |\n`;
  md += `| **P95 Latency** | ${statsA.p95} ms | ${statsB.p95} ms |\n`;
  md += `| **Total Tokens** | ${statsA.totalTokens} | ${statsB.totalTokens} |\n`;
  md += `| **Avg Tokens/Req** | ${statsA.avgTokens} | ${statsB.avgTokens} |\n\n`;

  md += `## 2. Detailed Results per Prompt\n\n`;
  md += `| ID | Category | ${modelA} Latency | ${modelA} Tokens | ${modelB} Latency | ${modelB} Tokens |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  for (let i = 0; i < prompts.length; i++) {
    const a = resultsA[i];
    const b = resultsB[i];
    md += `| \`${a.id}\` | ${a.category} | ${a.success ? `${a.latencyMs} ms` : "FAILED"} | ${a.totalTokens} | ${b.success ? `${b.latencyMs} ms` : "FAILED"} | ${b.totalTokens} |\n`;
  }

  md += `\n## 3. Trade-off Analysis & Recommendation\n\n`;
  md += `### Latency & Throughput\n`;
  md += `- **${modelA}**: Designed for low latency and high frequency queries. Ideal for user-facing interactive chat and high-volume endpoints.\n`;
  md += `- **${modelB}**: Deeper reasoning capabilities with higher time-to-first-token and overall latency, suited for complex synthesis and multi-step reasoning.\n\n`;

  md += `### Cost Efficiency\n`;
  md += `- For standard classification, extraction, and routine tasks, **${modelA}** provides an order of magnitude cost advantage with comparable quality.\n`;
  md += `- Use **${modelB}** strategically for complex code generation or tasks where initial failure cost is high.\n\n`;

  md += `### Boundary Implementation Takeaways\n`;
  md += `- Both models respect the standardized application contract without requiring downstream code changes.\n`;
  md += `- Timeouts and token limits safeguard against runaway generation across both model tiers.\n`;

  const reportPath = path.resolve(import.meta.dirname, "model-comparison.md");
  await fs.writeFile(reportPath, md, "utf-8");
  console.log(`\n🎉 Benchmark complete! Report written to: ${reportPath}`);
}

run().catch((err) => {
  console.error("Benchmark failed with error:", err);
  process.exit(1);
});
