"use client";

import TeamsContainerHeader from "./Teams/TeamsContainerHeader";
import FloatingWindowOption from "./FloatingWindowOption";
import NewTeamContainerHeader from "./NewTeam/NewTeamContainerHeader";
import NewTeamOptions from "./NewTeam/NewTeamOptions";
import Image from "next/image";
import { useState } from "react";
import NewTeamUnitOverview from "./NewTeam/NewTeamUnitOverview";
import NewTeamTraitContainer from "./NewTeam/NewTeamTraitContainer";

export default function MainContainer() {
  const [creatingTeam, setCreatingTeam] = useState(false);

  const handleCreatingTeam = (creatingTeam: boolean) => {
    setCreatingTeam(creatingTeam);
  };

  return (
    <>
      <main className="bg-neutral-900 rounded-3xl w-full p-6 flex flex-col">
        {creatingTeam ? (
          <div className="flex flex-col gap-4">
            <NewTeamContainerHeader handleCreatingTeam={handleCreatingTeam} />
            <NewTeamOptions />
            <div className="flex flex-row">
              <NewTeamUnitOverview />
              <NewTeamTraitContainer />
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
