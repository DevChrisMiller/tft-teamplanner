import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

// PUT /api/teams/:id — update name and/or replace units
export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // If units are included, replace them atomically
  if (Array.isArray(body.units)) {
    const team = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.teamUnit.deleteMany({ where: { teamId: id } });

      return tx.team.update({
        where: { id, userId: session.user.id },
        data: {
          ...(body.name && { name: body.name }),
          description: body.description ?? null,
          units: {
            create: (body.units as { unitId: string; slotIndex: number }[]).map((u) => ({
              unitId: u.unitId,
              slotIndex: u.slotIndex,
            })),
          },
        },
        include: { units: true },
      });
    });

    return NextResponse.json(team);
  }

  // Name/visibility-only update
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
