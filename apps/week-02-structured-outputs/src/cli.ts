#!/usr/bin/env node
import { Command } from 'commander';
import { TaskExtractorService } from './services/task-extractor.service.js';
import { AgentService } from './services/agent.service.js';
import { taskStore } from './storage/in-memory-task.store.js';

const program = new Command();

program
  .name('week02-cli')
  .description('Week 02: Structured Outputs & Tool Calling CLI Interface')
  .version('1.0.0');

program
  .command('extract <text>')
  .description('Extract a structured task from natural language text')
  .option('-m, --model <model>', 'Model name to use')
  .action(async (text, options) => {
    try {
      console.log(`\n⏳ Extracting structured task from: "${text}"...\n`);
      const result = await TaskExtractorService.extractFromText(text, options.model);
      console.log('✅ Extraction Successful:');
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('❌ Extraction Failed:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('chat <prompt>')
  .description('Execute an agent instruction with application-governed tool calling')
  .option('-m, --model <model>', 'Model name to use')
  .action(async (prompt, options) => {
    try {
      console.log(`\n🤖 Running Agent with prompt: "${prompt}"...\n`);
      const response = await AgentService.executePrompt(prompt, options.model);
      console.log('--- Agent Answer ---');
      console.log(response.answer);
      console.log('\n--- Metrics & Tool Steps ---');
      console.log(`Tool Calls Executed: ${response.toolCallsCount}`);
      console.log(`Token Usage: Total ${response.usage.totalTokens} (Prompt: ${response.usage.promptTokens}, Completion: ${response.usage.completionTokens})`);
      if (response.steps.length > 0) {
        console.log('\nSteps:');
        console.log(JSON.stringify(response.steps, null, 2));
      }
    } catch (err) {
      console.error('❌ Agent Failed:', err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all tasks currently in the in-memory task store')
  .action(() => {
    const tasks = taskStore.getAll();
    console.log(`\n📋 In-Memory Task Store (${tasks.length} tasks):`);
    console.table(
      tasks.map(t => ({
        ID: t.id.slice(0, 8) + '...',
        Title: t.title,
        Priority: t.priority,
        Status: t.status,
        DueDate: t.dueDate ?? 'None',
        Tags: t.tags.join(', '),
      }))
    );
  });

program.parse(process.argv);
