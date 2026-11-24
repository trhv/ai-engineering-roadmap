import { v4 as uuidv4 } from 'uuid';
import { TaskRecord, ExtractedTask } from '../schemas/task.schema.js';
import { SearchTasksArgs } from '../schemas/tools.schema.js';

export class InMemoryTaskStore {
  private tasks: Map<string, TaskRecord> = new Map();

  constructor() {
    this.seed();
  }

  public seed(): void {
    this.tasks.clear();
    const initialTasks: Array<Omit<TaskRecord, 'id' | 'createdAt' | 'updatedAt'>> = [
      {
        title: 'Implement OAuth2 PKCE login flow',
        description: 'Upgrade legacy session auth to OAuth2 authorization code with PKCE for mobile and SPA clients',
        priority: 'high',
        dueDate: '2026-12-15T18:00:00.000Z',
        tags: ['security', 'auth', 'oauth'],
        estimatedHours: 16,
        status: 'in_progress',
      },
      {
        title: 'Optimize Postgres vector similarity index',
        description: 'Tune HNSW parameters (m=16, ef_construction=64) to reduce query latency below 20ms',
        priority: 'medium',
        dueDate: '2026-12-20T12:00:00.000Z',
        tags: ['database', 'pgvector', 'performance'],
        estimatedHours: 8,
        status: 'pending',
      },
      {
        title: 'Fix critical production rate limiter leak',
        description: 'Redis cluster token bucket key TTL is failing under failover, leading to memory growth',
        priority: 'urgent',
        dueDate: '2026-11-30T23:59:59.000Z',
        tags: ['bug', 'redis', 'incident'],
        estimatedHours: 4,
        status: 'pending',
      },
      {
        title: 'Update developer documentation for Tool Calling API',
        description: 'Add OpenAPI specifications and curl examples for client integration',
        priority: 'low',
        dueDate: null,
        tags: ['docs', 'dx'],
        estimatedHours: 3,
        status: 'completed',
      },
    ];

    for (const t of initialTasks) {
      const id = uuidv4();
      const now = new Date().toISOString();
      this.tasks.set(id, {
        ...t,
        id,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  public search(args: SearchTasksArgs): TaskRecord[] {
    let results = Array.from(this.tasks.values());

    if (args.query && args.query.trim().length > 0) {
      const q = args.query.toLowerCase().trim();
      results = results.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    if (args.priority) {
      results = results.filter(t => t.priority === args.priority);
    }

    if (args.status) {
      results = results.filter(t => t.status === args.status);
    }

    if (args.tag) {
      const targetTag = args.tag.toLowerCase().trim();
      results = results.filter(t => t.tags.includes(targetTag));
    }

    return results.slice(0, args.limit ?? 10);
  }

  public createDraft(data: ExtractedTask): TaskRecord {
    const id = uuidv4();
    const now = new Date().toISOString();
    const record: TaskRecord = {
      ...data,
      id,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, record);
    return record;
  }

  public getById(id: string): TaskRecord | undefined {
    return this.tasks.get(id);
  }

  public getAll(): TaskRecord[] {
    return Array.from(this.tasks.values());
  }

  public count(): number {
    return this.tasks.size;
  }
}

export const taskStore = new InMemoryTaskStore();
