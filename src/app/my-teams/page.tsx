import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { fetchUnits } from "@/lib/datadragon";
import TeamGrid from "./components/TeamGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Teams — TFT Planner",
};

export default async function MyTeamsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [teams, allUnits] = await Promise.all([
    prisma.team.findMany({
      where: { userId: session.user.id },
      include: { units: { orderBy: { slotIndex: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }),
    fetchUnits(),
  ]);

  return (
    <main className="w-full py-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Teams</h1>
        <span className="text-neutral-400 text-sm">{teams.length} teams</span>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-lg">No teams saved yet.</p>
          <p className="text-sm mt-1">Build a team and click Save to get started.</p>
        </div>
      ) : (
        <TeamGrid teams={teams} allUnits={allUnits} />
      )}
    </main>
  );
}
