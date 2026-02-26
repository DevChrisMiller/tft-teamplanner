import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SET_CONFIG } from "@/lib/setConfig";

const MAX_NAME_LEN = 40;
const MAX_DESC_LEN = 500;
const MAX_SLOTS = 10;

function validateUnits(units: unknown): { unitId: string; slotIndex: number }[] | null {
  if (!Array.isArray(units) || units.length === 0 || units.length > MAX_SLOTS) return null;
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

// GET /api/teams — return the current user's teams
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    where: { userId: session.user.id },
    include: { units: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(teams);
}

interface CreateTeamBody {
  name: string;
  setId?: string;
  description?: string | null;
  units: { unitId: string; slotIndex: number }[];
}

// POST /api/teams — create a new team
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreateTeamBody = await request.json();

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  if (name.length > MAX_NAME_LEN) return NextResponse.json({ error: "Team name too long" }, { status: 400 });

  const description = body.description?.trim() ?? null;
  if (description && description.length > MAX_DESC_LEN) {
    return NextResponse.json({ error: "Description too long" }, { status: 400 });
  }

  const setId = body.setId ?? "TFT16";
  if (!Object.keys(SET_CONFIG).includes(setId)) {
    return NextResponse.json({ error: "Invalid set" }, { status: 400 });
  }

  const units = validateUnits(body.units);
  if (!units) return NextResponse.json({ error: "Invalid units" }, { status: 400 });

  const team = await prisma.team.create({
    data: {
      name,
      userId: session.user.id,
      setId,
      ...(description != null && { description }),
      units: {
        create: units.map((u) => ({
          unitId: u.unitId,
          slotIndex: u.slotIndex,
        })),
      },
    },
    include: { units: true },
  });

  return NextResponse.json(team, { status: 201 });
}
