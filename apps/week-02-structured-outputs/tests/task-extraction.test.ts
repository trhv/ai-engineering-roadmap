import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TaskExtractorService } from '../src/services/task-extractor.service.js';
import { AgentService } from '../src/services/agent.service.js';
import { TaskExtractionError } from '../src/errors/app-errors.js';
import { taskStore } from '../src/storage/in-memory-task.store.js';

describe('Task Extraction Service Integration', () => {
  it('throws TaskExtractionError if input is empty or too short', async () => {
    await assert.rejects(
      async () => {
        await TaskExtractorService.extractFromText('  ');
      },
      (err: unknown) => {
        return err instanceof TaskExtractionError && err.statusCode === 422;
      }
    );
  });

  it('extracts a structured task from natural language with inferred priority and tags', async (t) => {
    try {
      const input = 'We urgently need to fix the database connection pool leak in production before midnight! Tag backend and bug.';
      const result = await TaskExtractorService.extractFromText(input);

      assert.ok(result.task);
      assert.ok(result.task.title.length >= 3);
      assert.equal(result.task.priority, 'urgent');
      assert.ok(result.task.tags.includes('backend') || result.task.tags.includes('bug'));
      assert.ok(result.confidenceScore >= 0.5);
      assert.ok(result.reasoning.length > 0);
    } catch (err: any) {
      if (err?.message?.includes('quota') || err?.message?.includes('429')) {
        t.skip('Skipped due to upstream API quota limit: ' + err.message);
        return;
      }
      throw err;
    }
  });
});

describe('Conversational Agent Service Integration', () => {
  it('executes a tool search query when prompted to find tasks', async (t) => {
    try {
      taskStore.seed();
      const result = await AgentService.executePrompt('Search the workspace for any security related tasks.');

      assert.ok(result.answer.length > 0);
      assert.ok(result.toolCallsCount >= 1);
      assert.ok(result.usage.totalTokens > 0);
    } catch (err: any) {
      if (err?.message?.includes('quota') || err?.message?.includes('429')) {
        t.skip('Skipped due to upstream API quota limit: ' + err.message);
        return;
      }
      throw err;
    }
  });
});
