import Image from "next/image";
import { Unit } from "@/d";

interface Props {
  unit: Unit;
  cost: number;
  handleUpdateTeam: (x: Unit) => void;
}

export default function UnitSmallDetail({
  unit,
  cost,
  handleUpdateTeam,
}: Props) {
  const getBorderColor = (cost: number) => {
    const colorMap: Record<number, string> = {
      1: "border-neutral-400",
      2: "border-green-600",
      3: "border-cyan-600",
      4: "border-fuchsia-600",
      5: "border-yellow-400",
      6: "border-purple-700",
    };
    return colorMap[cost] || "border-neutral-400";
  };

  const getBgColor = (cost: number) => {
    const colorMap: Record<number, string> = {
      1: "bg-neutral-500",
      2: "bg-green-700",
      3: "bg-cyan-700",
      4: "bg-fuchsia-700",
      5: "bg-yellow-500",
      6: "bg-purple-800",
    };

    return colorMap[cost] || "bg-neutral-500";
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
      <div
        className={`flex flex-row items-center ${getBgColor(
          cost
        )} rounded-lg justify-self-center bg-opacity-50 w-fit h-10 p-0.5 pt-5 -mt-4`}
      >
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
