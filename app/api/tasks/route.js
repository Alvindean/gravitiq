// GET  /api/tasks — List all tasks
// POST /api/tasks — Create a new task
// PUT  /api/tasks — Update a task (e.g. toggle completion)

import { readCollection, insertOne, updateOne } from '@/app/lib/db';

export async function GET() {
  try {
    const tasks = await readCollection('tasks');
    return Response.json({
      success: true,
      data: tasks,
      meta: { total: tasks.length },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title) {
      return Response.json(
        { success: false, error: 'Task title is required' },
        { status: 400 }
      );
    }

    const newTask = {
      id: 'task_' + Date.now(),
      title: body.title,
      description: body.description || null,
      completed: false,
      priority: body.priority || 'medium',
      dueDate: body.dueDate || null,
      assignee: body.assignee || null,
      projectId: body.projectId || null,
      createdAt: new Date().toISOString(),
    };

    const saved = await insertOne('tasks', newTask);

    return Response.json(
      { success: true, data: saved },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return Response.json(
        { success: false, error: 'Task id is required' },
        { status: 400 }
      );
    }

    const updated = await updateOne('tasks', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      return Response.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: updated });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
