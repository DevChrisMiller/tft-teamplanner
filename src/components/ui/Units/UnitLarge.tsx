import Image from "next/image";
import { Unit } from "@/d";

interface Props {
  unit: Unit;
  handleUpdateTeam: (x: Unit) => void;
}

export default function UnitLarge({ unit, handleUpdateTeam }: Props) {
  return (
    <div className="text-center mx-1 my-2 w-16">
      <Image
        onClick={() => handleUpdateTeam(unit)}
        className="border-medium rounded-large border-green-100 cursor-pointer"
        src={`/splash-art/${unit.ImageSource1}`}
        alt={unit.Name}
        height={64}
        width={64}
      />
      <div className="flex flex-row items-center bg-neutral-600 w-fit h-5 justify-self-center rounded-b-lg p-0.5">
        {unit.Traits?.map((trait, i) => {
          return (
            <Image
              className="mx-0.5"
              src={`/traits/${trait}`}
              alt={`${trait}`}
              height={16}
              width={16}
              key={i}
            />
          );
        })}
      </div>
      <p className="text-xs break-normal">{unit.Name}</p>
    </div>
  );
}
