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
import { Unit, Trait } from "@/d";
import { Spinner } from "@nextui-org/react";

export default function MainContainer() {
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<(Unit | null)[]>(
    Array(10).fill(null)
  );
  const [units, setUnits] = useState<Unit[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch both units and traits in parallel
        const [unitsResponse, traitsResponse] = await Promise.all([
          fetch("/api/getUnits"),
          fetch("/api/getTraits"),
        ]);

        if (!unitsResponse.ok) {
          throw new Error("Failed to fetch units");
        }
        if (!traitsResponse.ok) {
          throw new Error("Failed to fetch traits");
        }

        const unitsData: Unit[] = await unitsResponse.json();
        const traitsData: Trait[] = await traitsResponse.json();

        // Create a map of traits by ID for easy lookup
        const traitsMap: Record<number, Trait> = {};
        traitsData.forEach((trait) => {
          traitsMap[trait.ID] = trait;
        });

        // Enhance units with their associated traits
        const enhancedUnits: Unit[] = unitsData.map((unit) => {
          const unitTraits: Trait[] = [];

          // Add traits based on non-null Trait IDs
          if (unit.Trait1ID) unitTraits.push(traitsMap[unit.Trait1ID]);
          if (unit.Trait2ID) unitTraits.push(traitsMap[unit.Trait2ID]);
          if (unit.Trait3ID) unitTraits.push(traitsMap[unit.Trait3ID]);

          return {
            ...unit,
            Traits: unitTraits,
          };
        });

        setUnits(enhancedUnits);
        setTraits(traitsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array since we only want to fetch once

  const handleCreatingTeam = (creatingTeam: boolean) => {
    setCreatingTeam(creatingTeam);
  };

  const handleUpdateTeam = (unit: Unit, index: number) => {
    setCurrentTeam((prevTeam) => {
      const newTeam = [...prevTeam];
      if (newTeam[index]?.ID === unit.ID) {
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

  // if (isLoading) {
  //   return (
  //     <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
  //       <div className="flex items-center justify-center h-full w-full">
  //         <Spinner size="lg" />
  //       </div>
  //     </main>
  //   );
  // }

  // if (error) {
  //   return (
  //     <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
  //       <div className="text-red-500 p-4">Error: {error}</div>
  //     </main>
  //   );
  // }

  return (
    <>
      <main className="bg-neutral-900 rounded-3xl w-full p-2 lg:p-6 md:p-4 sm:p-2 flex flex-col h-full">
        {creatingTeam ? (
          <div className="flex flex-col gap-4 h-full">
            <NewTeamContainerHeader handleCreatingTeam={handleCreatingTeam} />
            <NewTeamOptions handleClearTeam={handleClearTeam} />
            <div className="flex flex-row gap-2 h-[600px]">
              <NewTeamUnitOverview
                handleUpdateTeam={handleUpdateTeam}
                currentTeam={currentTeam}
                units={units}
              />
              <NewTeamTraitContainer
                currentTeam={currentTeam}
                traits={traits}
              />
              <NewTeamContainer currentTeam={currentTeam} />
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
