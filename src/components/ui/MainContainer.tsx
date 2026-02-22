"use client";

import TeamsContainerHeader from "./Teams/TeamsContainerHeader";
import FloatingWindowOption from "./FloatingWindowOption";
import NewTeamContainerHeader from "./NewTeam/NewTeamContainerHeader";
import NewTeamOptions from "./NewTeam/NewTeamOptions";
import Image from "next/image";
import { useState, useEffect } from "react";
import NewTeamUnitOverview from "./NewTeam/NewTeamUnitOverview";
import NewTeamTraitContainer from "./NewTeam/NewTeamTraitContainer";
import NewTeamContainer from "./NewTeam/NewTeamContainer";
import { Spinner } from "@nextui-org/react";
import { Unit } from "@/d";
import { useSession, signIn } from "next-auth/react";
import { DEFAULT_SET_KEY } from "@/lib/setConfig";

export default function MainContainer() {
  const { data: session } = useSession();

  const [creatingTeam, setCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<(Unit | null)[]>(
    Array(10).fill(null)
  );
  const [teamName, setTeamName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [sortByTrait, setSortByTrait] = useState(false);

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
      // Reset team state when exiting team builder
      setCurrentTeam(Array(10).fill(null));
      setTeamName("");
      setSaveSuccess(false);
    }
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
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim() || "Untitled Team",
          setId: DEFAULT_SET_KEY,
          units: unitsToSave,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveSuccess(true);
      // Reset after a short delay so user sees feedback
      setTimeout(() => {
        handleCreatingTeam(false);
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
      <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
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
            <TeamsContainerHeader handleCreatingTeam={handleCreatingTeam} />
            <div className="flex flex-col justify-center mx-auto p-6 text-center gap-2">
              <Image
                src="/penguin-icon.png"
                alt="pengu"
                height={200}
                width={200}
                className="p-4 mx-auto"
              />
              <h2 className="text-2xl font-semibold">
                Create your first team!
              </h2>
              <p className="text-neutral-400">
                Save multiple teams and share them with your friends
              </p>
            </div>
          </>
        )}
      </main>
      <FloatingWindowOption />
    </>
  );
}
