import Image from "next/image";
import { Unit } from "@/d";

interface Props {
  unit: Unit;
  color: string;
}

export default function UnitSmallDetail({ unit, color }: Props) {
  return (
    <div className=" text-center m-1 w-16">
      <Image
        onClick={() => {
          console.log(`adding ${unit.name} to team`);
        }}
        className="border-medium rounded-large border-green-100 cursor-pointer"
        src={`/splash-art/${unit.imgsrc}`}
        alt={unit.name}
        height={64}
        width={64}
      />
      <p className="text-xs break-normal">{unit.name}</p>
    </div>
  );
}
