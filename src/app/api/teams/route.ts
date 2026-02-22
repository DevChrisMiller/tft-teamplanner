import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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
  units: { unitId: string; slotIndex: number }[];
}

// POST /api/teams — create a new team
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreateTeamBody = await request.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name: body.name.trim(),
      userId: session.user.id,
      setId: body.setId ?? "TFT16",
      units: {
        create: body.units.map((u) => ({
          unitId: u.unitId,
          slotIndex: u.slotIndex,
        })),
      },
    },
    include: { units: true },
  });

  return NextResponse.json(team, { status: 201 });
}
