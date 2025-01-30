"use client";

import TeamsContainerHeader from "./Teams/TeamsContainerHeader";
import FloatingWindowOption from "./FloatingWindowOption";
import NewTeamContainerHeader from "./NewTeam/NewTeamContainerHeader";
import NewTeamOptions from "./NewTeam/NewTeamOptions";
import Image from "next/image";
import { useState } from "react";
import NewTeamUnitOverview from "./NewTeam/NewTeamUnitOverview";
import NewTeamTraitContainer from "./NewTeam/NewTeamTraitContainer";
import NewTeamContainer from "./NewTeam/NewTeamContainer";
import { Unit } from "@/d";

export default function MainContainer() {
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<(Unit | null)[]>(
    Array(10).fill(null)
  );

  const handleCreatingTeam = (creatingTeam: boolean) => {
    setCreatingTeam(creatingTeam);
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
              />
              <NewTeamTraitContainer />
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
