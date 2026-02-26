import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

function generateSlug(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/teams/:id/share — make a team public and generate a slug
export async function POST(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check team exists and belongs to this user
  const existing = await prisma.team.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // If already has a slug, return it
  if (existing.slug) {
    return NextResponse.json({ slug: existing.slug });
  }

  // Generate a unique slug (retry on collision)
  let slug = generateSlug();
  let attempts = 0;
  while (attempts < 5) {
    const collision = await prisma.team.findUnique({ where: { slug } });
    if (!collision) break;
    slug = generateSlug();
    attempts++;
  }

  const team = await prisma.team.update({
    where: { id, userId: session.user.id },
    data: { isPublic: true, slug },
  });

  return NextResponse.json({ slug: team.slug });
}

// DELETE /api/teams/:id/share — make a team private (remove slug)
export async function DELETE(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await prisma.team.update({
    where: { id, userId: session.user.id },
    data: { isPublic: false, slug: null },
  });

  return NextResponse.json({ ok: true, team });
}
