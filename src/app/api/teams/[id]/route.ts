import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { SET_CONFIG } from "@/lib/setConfig";

const MAX_NAME_LEN = 40;
const MAX_DESC_LEN = 500;

function validateUnits(units: unknown): { unitId: string; slotIndex: number }[] | null {
  if (!Array.isArray(units) || units.length === 0 || units.length > 10) return null;
  for (const u of units) {
    if (
      typeof u.unitId !== "string" ||
      !u.unitId.trim() ||
      typeof u.slotIndex !== "number" ||
      !Number.isInteger(u.slotIndex) ||
      u.slotIndex < 0 ||
      u.slotIndex > 9
    ) {
      return null;
    }
  }
  return units as { unitId: string; slotIndex: number }[];
}

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

  const name = body.name?.trim();
  if (name !== undefined) {
    if (!name) return NextResponse.json({ error: "Team name is required" }, { status: 400 });
    if (name.length > MAX_NAME_LEN) return NextResponse.json({ error: "Team name too long" }, { status: 400 });
  }

  const description = body.description === null ? null : body.description?.trim() ?? undefined;
  if (typeof description === "string" && description.length > MAX_DESC_LEN) {
    return NextResponse.json({ error: "Description too long" }, { status: 400 });
  }

  if (body.setId !== undefined && !Object.keys(SET_CONFIG).includes(body.setId)) {
    return NextResponse.json({ error: "Invalid set" }, { status: 400 });
  }

  // If units are included, validate and replace atomically
  if (Array.isArray(body.units)) {
    const units = validateUnits(body.units);
    if (!units) return NextResponse.json({ error: "Invalid units" }, { status: 400 });

    const team = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.teamUnit.deleteMany({ where: { teamId: id } });

      return tx.team.update({
        where: { id, userId: session.user.id },
        data: {
          ...(name && { name }),
          description: description ?? null,
          units: {
            create: units.map((u) => ({
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
      ...(name && { name }),
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
