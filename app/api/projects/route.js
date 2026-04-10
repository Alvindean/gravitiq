// GET  /api/projects — List all projects
// POST /api/projects — Create a new project

import { readCollection, insertOne } from '@/app/lib/db';

export async function GET() {
  try {
    const projects = await readCollection('projects');
    return Response.json({
      success: true,
      data: projects,
      meta: { total: projects.length },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, clientId, priority, dueDate } = body;

    if (!title) {
      return Response.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    const newProject = {
      id: 'p' + Date.now(),
      title,
      client: clientId
        ? { id: clientId, name: body.clientName || 'Unresolved Client', company: body.clientCompany || null }
        : null,
      status: 'not-started',
      priority: priority || 'medium',
      progress: 0,
      dueDate: dueDate || null,
      team: body.team || [],
      createdAt: new Date().toISOString(),
    };

    const saved = await insertOne('projects', newProject);

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
