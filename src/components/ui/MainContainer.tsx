"use client";

import TeamsContainerHeader from "./Teams/TeamsContainerHeader";
import FloatingWindowOption from "./FloatingWindowOption";
import NewTeamContainerHeader from "./NewTeam/NewTeamContainerHeader";
import NewTeamOptions from "./NewTeam/NewTeamOptions";
import { useState, useEffect, useCallback } from "react";
import NewTeamUnitOverview from "./NewTeam/NewTeamUnitOverview";
import NewTeamTraitContainer from "./NewTeam/NewTeamTraitContainer";
import NewTeamContainer from "./NewTeam/NewTeamContainer";
import TeamGrid from "@/app/my-teams/components/TeamGrid";
import { Spinner } from "@nextui-org/react";
import { Unit } from "@/d";
import { useSession, signIn } from "next-auth/react";
import { DEFAULT_SET_KEY } from "@/lib/setConfig";
import Image from "next/image";

interface SavedTeam {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  slug: string | null;
  setId: string;
  upvoteCount: number;
  createdAt: string;
  updatedAt: string;
  units: { id: string; teamId: string; unitId: string; slotIndex: number }[];
}

export default function MainContainer() {
  const { data: session } = useSession();

  const [creatingTeam, setCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<(Unit | null)[]>(
    Array(10).fill(null)
  );
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [sortByTrait, setSortByTrait] = useState(false);

  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Fetch CDragon units
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/getUnits");
        if (!res.ok) throw new Error("Failed to fetch units");
        const units: Unit[] = await res.json();
        setAllUnits(units);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch saved teams when logged in
  const fetchSavedTeams = useCallback(async () => {
    if (!session?.user?.id) return;
    setTeamsLoading(true);
    try {
      const res = await fetch("/api/teams");
      if (res.ok) setSavedTeams(await res.json());
    } finally {
      setTeamsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchSavedTeams();
  }, [fetchSavedTeams]);

  useEffect(() => {
    const filtered = allUnits.filter((unit: Unit) => {
      return (
        unit.name.toLowerCase().includes(searchPhrase.toLowerCase()) ||
        unit.traits.some((trait) =>
          trait.name.toLowerCase().includes(searchPhrase.toLowerCase())
        )
      );
    });
    setFilteredUnits(filtered);
  }, [searchPhrase, allUnits]);

  const handleCreatingTeam = (creating: boolean) => {
    setCreatingTeam(creating);
    if (!creating) {
      setCurrentTeam(Array(10).fill(null));
      setTeamName("");
      setTeamDescription("");
      setSaveSuccess(false);
      setEditingTeamId(null);
    }
  };

  const handleEditTeam = (teamId: string, name: string, units: (Unit | null)[]) => {
    setEditingTeamId(teamId);
    setTeamName(name);
    setCurrentTeam(units);
    const team = savedTeams.find((t) => t.id === teamId);
    setTeamDescription(team?.description ?? "");
    setCreatingTeam(true);
  };

  const handleUpdateTeam = (unit: Unit, index: number) => {
    setCurrentTeam((prevTeam) => {
      const newTeam = [...prevTeam];
      if (newTeam[index]?.id === unit.id) {
        newTeam[index] = null;
      } else {
        newTeam[index] = unit;
      }
      return newTeam;
    });
  };

  const handleClearTeam = () => {
    setCurrentTeam(Array(10).fill(null));
  };

  const handleUpdateSearch = (phrase: string) => {
    setSearchPhrase(phrase);
  };

  const handleUpdateSort = (filterType: boolean) => {
    setSortByTrait(!filterType);
  };

  const handleSaveTeam = async () => {
    if (!session) {
      signIn("discord");
      return;
    }

    const unitsToSave = currentTeam
      .map((unit, index) => ({ unit, index }))
      .filter(({ unit }) => unit !== null)
      .map(({ unit, index }) => ({ unitId: unit!.id, slotIndex: index }));

    if (unitsToSave.length === 0) return;

    try {
      setIsSaving(true);
      const url = editingTeamId ? `/api/teams/${editingTeamId}` : "/api/teams";
      const method = editingTeamId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim() || "Untitled Team",
          setId: DEFAULT_SET_KEY,
          description: teamDescription.trim() || null,
          units: unitsToSave,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveSuccess(true);
      setTimeout(() => {
        handleCreatingTeam(false);
        fetchSavedTeams();
      }, 1200);
    } catch (err) {
      console.error("Failed to save team:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
        <div className="flex items-center justify-center h-full w-full">
          <Spinner size="lg" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <p className="text-red-400 font-medium">Failed to load game data</p>
          <p className="text-neutral-500 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col gap-4 h-full">
        {creatingTeam ? (
          <div className="flex flex-col gap-4 h-full">
            <NewTeamContainerHeader
              handleCreatingTeam={handleCreatingTeam}
              teamName={teamName}
              handleUpdateTeamName={setTeamName}
              handleSaveTeam={handleSaveTeam}
              isSaving={isSaving}
              currentTeam={currentTeam}
              allUnits={allUnits}
              handleLoadTeam={setCurrentTeam}
            />
            <textarea
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="Add notes about how to play this comp... (optional)"
              rows={2}
              className="w-full bg-neutral-800 text-sm text-white rounded-xl px-3 py-2 resize-none placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
            {saveSuccess && (
              <p className="text-green-400 text-sm text-center">
                Team saved! Redirecting...
              </p>
            )}
            <NewTeamOptions
              handleClearTeam={handleClearTeam}
              handleUpdateSearch={handleUpdateSearch}
              handleUpdateSort={handleUpdateSort}
              sortByTrait={sortByTrait}
              currentTeam={currentTeam}
            />
            <div className="flex flex-row gap-2 h-[600px]">
              <NewTeamUnitOverview
                handleUpdateTeam={handleUpdateTeam}
                currentTeam={currentTeam}
                units={searchPhrase ? filteredUnits : allUnits}
                sortByTrait={sortByTrait}
              />
              <NewTeamTraitContainer currentTeam={currentTeam} />
              <NewTeamContainer
                currentTeam={currentTeam}
                handleUpdateTeam={handleUpdateTeam}
              />
            </div>
          </div>
        ) : (
          <>
            <TeamsContainerHeader
              handleCreatingTeam={handleCreatingTeam}
              allUnits={allUnits}
              handleLoadTeam={(team) => {
                setCurrentTeam(team);
                setCreatingTeam(true);
              }}
            />

            {!session ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <p className="text-neutral-400">
                  Sign in to save and manage your teams.
                </p>
                <button
                  onClick={() => signIn("discord")}
                  className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] transition-colors text-white font-semibold px-5 py-2 rounded-xl text-sm"
                >
                  Sign in with Discord
                </button>
              </div>
            ) : teamsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : savedTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <Image src="/penguin-icon.png" alt="pengu" height={128} width={128} className="opacity-70" />
                <p className="text-lg font-semibold">No teams saved yet</p>
                <p className="text-neutral-400 text-sm">
                  Click &quot;New Team&quot; to build and save your first comp.
                </p>
              </div>
            ) : (
              <TeamGrid
                teams={savedTeams}
                allUnits={allUnits}
                onMutated={fetchSavedTeams}
                onEdit={handleEditTeam}
              />
            )}
          </>
        )}
      </main>
      <FloatingWindowOption />
    </>
  );
}
