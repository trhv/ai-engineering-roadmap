import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TaskSchema, PriorityEnum } from '../src/schemas/task.schema.js';
import { SearchTasksArgsSchema, CreateDraftTaskArgsSchema } from '../src/schemas/tools.schema.js';

describe('TaskSchema Validation', () => {
  it('validates a complete valid task', () => {
    const valid = {
      title: 'Upgrade Express to v5',
      description: 'Migrate routing logic and test backward compatibility',
      priority: 'high',
      dueDate: '2026-12-01T17:00:00.000Z',
      tags: ['Backend', 'express ', 'upgrade!'],
      estimatedHours: 6,
    };
    const parsed = TaskSchema.parse(valid);
    assert.equal(parsed.title, 'Upgrade Express to v5');
    assert.equal(parsed.priority, 'high');
    assert.deepEqual(parsed.tags, ['backend', 'express', 'upgrade']);
  });

  it('applies default priority (medium) and tags ([]) when omitted', () => {
    const partial = {
      title: 'Fix typo in README',
    };
    const parsed = TaskSchema.parse(partial);
    assert.equal(parsed.priority, 'medium');
    assert.equal(parsed.description, '');
    assert.equal(parsed.dueDate, null);
    assert.deepEqual(parsed.tags, []);
    assert.equal(parsed.estimatedHours, null);
  });

  it('rejects title shorter than 3 characters', () => {
    assert.throws(() => {
      TaskSchema.parse({ title: 'Hi' });
    }, /at least 3 characters/);
  });

  it('rejects invalid priority value', () => {
    assert.throws(() => {
      TaskSchema.parse({ title: 'Fix bug', priority: 'super-urgent' });
    });
  });

  it('rejects invalid dueDate format', () => {
    assert.throws(() => {
      TaskSchema.parse({ title: 'Fix bug', dueDate: 'next tuesday morning' });
    }, /dueDate must be a valid ISO 8601/);
  });

  it('rejects more than 5 tags', () => {
    assert.throws(() => {
      TaskSchema.parse({
        title: 'Over-tagged task',
        tags: ['one', 'two', 'three', 'four', 'five', 'six'],
      });
    }, /Maximum of 5 tags/);
  });

  it('rejects negative or excessive estimatedHours', () => {
    assert.throws(() => {
      TaskSchema.parse({ title: 'Fix bug', estimatedHours: -2 });
    });
    assert.throws(() => {
      TaskSchema.parse({ title: 'Fix bug', estimatedHours: 150 });
    });
  });
});

describe('Tool Arguments Schemas', () => {
  it('validates SearchTasksArgsSchema defaults and constraints', () => {
    const defaultSearch = SearchTasksArgsSchema.parse({});
    assert.equal(defaultSearch.limit, 10);

    const boundedSearch = SearchTasksArgsSchema.parse({ limit: 20 });
    assert.equal(boundedSearch.limit, 20);

    assert.throws(() => {
      SearchTasksArgsSchema.parse({ limit: 50 });
    }, /cannot exceed 20/);
  });

  it('validates CreateDraftTaskArgsSchema', () => {
    const draft = CreateDraftTaskArgsSchema.parse({
      title: 'New Feature Draft',
      priority: 'low',
    });
    assert.equal(draft.title, 'New Feature Draft');
    assert.equal(draft.priority, 'low');
  });
});
