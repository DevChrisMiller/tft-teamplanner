import { Unit } from "@/d";

interface Props {
  currentTeam: Unit[];
}
export default function NewTeamContainer({ currentTeam }: Props) {
  const MAX_TEAM_SIZE = 10;
  const placeholdersNeeded = MAX_TEAM_SIZE - currentTeam.length;

  return (
    <>
      <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-3 gap-4 m-2 h-fit w-full">
        {currentTeam.map((unit, i) => {
          return (
            <div
              key={i}
              className="flex items-center justify-center w-26 h-40 rounded-md bg-neutral-800"
            >
              <span className="text-neutral-600">{unit.name}</span>
            </div>
          );
        })}
        {[...Array(placeholdersNeeded)].map((unit, i) => {
          return (
            <div
              key={i}
              className="flex items-center justify-center w-26 h-40 rounded-md bg-neutral-800"
            >
              <span className="text-neutral-600">
                {i + currentTeam.length + 1}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
