import { Unit } from "@/d";

interface Props {
  currentTeam: (Unit | null)[];
}

export default function NewTeamContainer({ currentTeam }: Props) {
  return (
    <>
      <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 m-2 h-fit w-full">
        {currentTeam.map((unit, i) => {
          return (
            <div
              key={i}
              className="flex items-center justify-center w-26 h-40 rounded-md bg-neutral-800"
            >
              <span className="text-neutral-600">
                {unit ? unit.name : i + 1}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
