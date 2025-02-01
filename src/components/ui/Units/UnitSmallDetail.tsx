import Image from "next/image";
import { Unit } from "@/d";

interface Props {
  unit: Unit;
  color: string;
  handleUpdateTeam: (x: Unit) => void;
}

export default function UnitSmallDetail({
  unit,
  color,
  handleUpdateTeam,
}: Props) {
  return (
    <div className="text-center mx-1 my-2 w-16">
      <Image
        onClick={() => handleUpdateTeam(unit)}
        className="border-medium rounded-large border-green-100 cursor-pointer relative"
        src={`/splash-art/${unit.imgsrc}`}
        alt={unit.name}
        height={64}
        width={64}
      />
      <div className="flex flex-row items-center bg-neutral-600 w-fit h-10 justify-self-center rounded-lg p-0.5 pt-5 -mt-4">
        {unit.traits.map((trait, i) => {
          return (
            <Image
              className="mx-0.5"
              src={`/traits/${trait.replaceAll(" ", "")}.png`}
              alt={`${trait}`}
              height={16}
              width={16}
              key={i}
            />
          );
        })}
      </div>
      <p className="text-xs break-normal">{unit.name}</p>
    </div>
  );
}
