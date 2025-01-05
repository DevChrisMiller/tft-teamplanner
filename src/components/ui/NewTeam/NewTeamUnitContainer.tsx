import { Unit } from "@/d";
import UnitSmallDetail from "../Units/UnitSmallDetail";
import Image from "next/image";
interface Props {
  units: Unit[];
}
export default function NewTeamUnitContainer({ units }: Props) {
  console.log(units[1].cost);
  console.log(units);
  const cost: number = units[1].cost;

  const getBgColorClass = (cost: number): string => {
    const colorMap: Record<number, string> = {
      1: "bg-neutral-600",
      2: "bg-green-800",
      3: "bg-cyan-800",
      4: "bg-fuchsia-800",
      5: "bg-yellow-600",
      6: "bg-purple-900",
    };
    return colorMap[cost] || "bg-white";
  };

  return (
    <>
      <div
        className={`${getBgColorClass(
          cost
        )} w-96 rounded-xl h-fit bg-opacity-40 flex flex-col p-2 mb-3 mr-2`}
      >
        <div className="flex flex-row m-2">
          <Image
            className="mr-2"
            src="/general/gold-icon.webp"
            alt="gold icon"
            height={12}
            width={20}
          />
          <span>{cost}</span>
        </div>
        <div className="flex flex-row flex-wrap justify-start">
          {units.map((unit) => {
            return (
              <UnitSmallDetail
                unit={unit}
                color={getBgColorClass(cost)}
                key={unit.name}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
