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

  const [teams, total] = await prisma.$transaction([
    prisma.team.findMany({
      where,
      include: {
        units: true,
        user: { select: { name: true, image: true } },
        ...(userId
          ? { upvotes: { where: { userId }, select: { userId: true } } }
          : {}),
      },
      orderBy: { upvoteCount: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.team.count({ where }),
  ]);

  const result = teams.map((team) => ({
    ...team,
    hasUpvoted: userId
      ? (team.upvotes as { userId: string }[] | undefined)?.length === 1
      : false,
    upvotes: undefined,
  }));

  return NextResponse.json({ teams: result, total, page, limit });
}
