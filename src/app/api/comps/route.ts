import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET /api/comps?set=TFT13&page=1
export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { searchParams } = new URL(request.url);
  const set = searchParams.get("set") ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 20;

  const where = {
    isPublic: true,
    ...(set ? { setId: set } : {}),
  };

  const teams = await prisma.team.findMany({
    where,
    include: {
      units: true,
      user: { select: { name: true, image: true } },
      upvotes: {
        where: { userId: userId ?? "\0" },
        select: { userId: true },
      },
    },
    orderBy: { upvoteCount: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.team.count({ where });

  const result = teams.map((team) => ({
    ...team,
    hasUpvoted: team.upvotes.length === 1,
    upvotes: undefined,
  }));

  return NextResponse.json({ teams: result, total, page, limit });
}
