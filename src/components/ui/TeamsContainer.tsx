"use client";

import TeamsContainerHeader from "./TeamsContainerHeader";
import FloatingWindowOption from "./FloatingWindowOption";
import Image from "next/image";

export default function TeamsContainer() {
  return (
    <>
      <div className="bg-neutral-900 rounded-3xl w-full p-6 flex flex-col">
        <TeamsContainerHeader />
        <div className="flex flex-col justify-center mx-auto p-6 text-center gap-2">
          <Image
            src="/penguin-icon.png"
            alt="pengu"
            height={200}
            width={200}
            className="p-4 mx-auto"
          />
          <h2 className="text-2xl font-semibold">Create your first team!</h2>
          <p className="text-neutral-400">
            Save multiple teams and share them with your friends
          </p>
        </div>
      </div>
      <FloatingWindowOption />
    </>
  );
}
