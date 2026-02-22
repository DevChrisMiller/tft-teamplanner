import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/teams/:id/upvote — add upvote
export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$transaction([
      prisma.upvote.create({
        data: { userId: session.user.id, teamId: id },
      }),
      prisma.team.update({
        where: { id },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);
  } catch {
    // Unique constraint violation = already upvoted
    return NextResponse.json({ error: "Already upvoted" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/teams/:id/upvote — remove upvote
export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$transaction([
      prisma.upvote.delete({
        where: {
          userId_teamId: { userId: session.user.id, teamId: id },
        },
      }),
      prisma.team.update({
        where: { id },
        data: { upvoteCount: { decrement: 1 } },
      }),
    ]);
  } catch {
    return NextResponse.json({ error: "Upvote not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
