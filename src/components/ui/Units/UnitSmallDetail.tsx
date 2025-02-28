import Image from "next/image";
import { Unit } from "@/d";

interface Props {
  unit: Unit;
  handleUpdateTeam: (x: Unit) => void;
}

export default function UnitSmallDetail({ unit, handleUpdateTeam }: Props) {
  const getBorderColor = (cost: number) => {
    const colorMap: Record<number, string> = {
      1: "border-neutral-400",
      2: "border-green-600",
      3: "border-cyan-600",
      4: "border-fuchsia-600",
      5: "border-yellow-400",
      6: "border-purple-700",
    };
    return colorMap[cost];
  };

  return (
    <div className="text-center mx-1 my-2 w-16">
      <Image
        onClick={() => handleUpdateTeam(unit)}
        className={`${getBorderColor(
          unit.Cost
        )} border-medium rounded-large cursor-pointer relative`}
        src={`/splash-art/${unit.ImageSource1}`}
        alt={unit.Name}
        height={64}
        width={64}
      />
      <div className="flex flex-row items-center bg-neutral-600 w-fit h-10 justify-self-center rounded-lg p-0.5 pt-5 -mt-4">
        {unit?.Traits?.map((trait, i) => {
          return (
            <Image
              className="mx-0.5"
              src={`/traits/${trait.ImageSource}`}
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
