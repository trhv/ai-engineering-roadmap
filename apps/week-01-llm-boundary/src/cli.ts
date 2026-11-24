import { Command } from "commander";
import readline from "readline";
import { v4 as uuidv4 } from "uuid";
import { llmService } from "./services/llm.service.js";
import { env } from "./config/env.js";

const program = new Command();

program
  .name("week01-cli")
  .description("Interactive CLI tester for LLM Application Boundary")
  .version("1.0.0")
  .option("-m, --model <model>", "Model identifier", env.DEFAULT_MODEL)
  .option("-s, --system <system>", "Optional system prompt")
  .option("-t, --temperature <temp>", "Temperature (0.0 to 2.0)", "0.7")
  .option("-p, --prompt <prompt>", "Single prompt to run directly")
  .action(async (options) => {
    const model = options.model;
    const systemPrompt = options.system;
    const temperature = parseFloat(options.temperature);

    if (options.prompt) {
      await runSinglePrompt(options.prompt, model, systemPrompt, temperature);
      return;
    }

    startInteractiveRepl(model, systemPrompt, temperature);
  });

async function runSinglePrompt(
  prompt: string,
  model: string,
  systemPrompt?: string,
  temperature?: number
) {
  const requestId = uuidv4();
  console.log(`\n⏳ Querying [${model}] (Request ID: ${requestId})...\n`);

  try {
    const res = await llmService.generate(
      {
        prompt,
        model,
        systemPrompt,
        temperature,
      },
      requestId
    );

    console.log("────────────────────────────────────────────────────────────");
    console.log(`🤖 Output:\n\n${res.content}\n`);
    console.log("────────────────────────────────────────────────────────────");
    console.log(`⏱️ Latency: ${res.latencyMs} ms`);
    console.log(`📊 Tokens:  Prompt: ${res.usage.promptTokens} | Completion: ${res.usage.completionTokens} | Total: ${res.usage.totalTokens}`);
    console.log(`🏁 Finish:  ${res.finishReason}`);
    console.log("────────────────────────────────────────────────────────────\n");
  } catch (err: any) {
    console.error(`\n❌ [${err.code || "ERROR"}]: ${err.message}`);
    if (err.details) {
      console.error("Details:", JSON.stringify(err.details, null, 2));
    }
  }
}

function startInteractiveRepl(
  model: string,
  systemPrompt?: string,
  temperature?: number
) {
  console.log("\n============================================================");
  console.log("  LLM Application Boundary — Interactive CLI Tester");
  console.log(`  Model: ${model}`);
  console.log(`  System Prompt: ${systemPrompt || "(none)"}`);
  console.log(`  Temperature: ${temperature}`);
  console.log("  Type 'exit' or press Ctrl+C to quit.");
  console.log("============================================================\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Prompt > ",
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    if (!trimmed) {
      rl.prompt();
      return;
    }

    await runSinglePrompt(trimmed, model, systemPrompt, temperature);
    rl.prompt();
  }).on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}

program.parse(process.argv);
