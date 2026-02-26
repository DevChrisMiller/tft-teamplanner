import { Suspense } from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { fetchUnits } from "@/lib/datadragon";
import { DEFAULT_SET_KEY } from "@/lib/setConfig";
import type { Unit } from "@/d";
import CompCard, { type CompTeam } from "./components/CompCard";
import FilterBar from "./components/FilterBar";
import Pagination from "./components/Pagination";
import CompsLoading from "./loading";

interface PageProps {
  searchParams: Promise<{ set?: string; page?: string; sort?: string }>;
}

async function CompsList({
  set,
  page,
  userId,
  sort,
}: {
  set: string;
  page: number;
  userId: string | null;
  sort: string;
}) {
  const limit = 20;

  const where = {
    isPublic: true,
    ...(set !== "all" ? { setId: set } : {}),
  };

  const orderBy =
    sort === "new"
      ? { createdAt: "desc" as const }
      : { upvoteCount: "desc" as const };

  const teams = await prisma.team.findMany({
    where,
    include: {
      units: true,
      user: { select: { name: true, image: true } },
      upvotes: {
        where: { userId: userId ?? "" },
        select: { userId: true },
      },
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const [total, allUnits] = await Promise.all([
    prisma.team.count({ where }),
    fetchUnits(DEFAULT_SET_KEY),
  ]);

  const unitMap = new Map<string, Unit>(allUnits.map((u) => [u.id, u]));

  const comps: CompTeam[] = teams.map((team) => ({
    ...team,
    hasUpvoted: team.upvotes.length === 1,
    upvotes: undefined,
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6">
      {comps.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          No public comps yet. Be the first to share one!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {comps.map((team) => (
            <CompCard key={team.id} team={team} unitMap={unitMap} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Suspense>
          <Pagination page={page} totalPages={totalPages} total={total} />
        </Suspense>
      )}
    </div>
  );
}

export default async function CompsPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { set, page: pageParam, sort: sortParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const effectiveSet = set ?? DEFAULT_SET_KEY;
  const effectiveSort = sortParam ?? "top";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Community Comps</h1>
        <p className="text-neutral-400 text-sm">
          Top team compositions shared by the community.
        </p>
      </div>

      <Suspense>
        <FilterBar />
      </Suspense>

      <Suspense fallback={<CompsLoading />}>
        <CompsList set={effectiveSet} page={page} userId={userId} sort={effectiveSort} />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Community Comps | TFT Team Planner",
  description: "Browse and upvote top TFT team compositions shared by the community.",
};
