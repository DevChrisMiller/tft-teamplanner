import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/teams/:id
export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await prisma.team.findUnique({
    where: { id, userId: session.user.id },
    include: { units: true },
  });

  if (!team) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(team);
}

// PUT /api/teams/:id — update name or visibility
export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const team = await prisma.team.update({
    where: { id, userId: session.user.id },
    data: {
      ...(body.name && { name: body.name }),
      ...(typeof body.isPublic === "boolean" && { isPublic: body.isPublic }),
    },
  });

  return NextResponse.json(team);
}

// DELETE /api/teams/:id
export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.team.delete({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
