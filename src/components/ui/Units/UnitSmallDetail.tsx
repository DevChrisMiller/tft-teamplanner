import Image from "next/image";
import { Unit } from "@/d";
import { motion } from "framer-motion";
import { getBorderColor } from "@/utils/getBorderColor";
import { getBgColor } from "@/utils/getBgColor";

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
  return (
    <div className="text-center mx-1 my-2 w-16">
      <div
        className={`w-16 h-16 overflow-hidden ${getBorderColor(
          unit.Cost
        )} border-medium rounded-large relative`}
      >
        <motion.div
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          className="w-full h-full"
        >
          <Image
            onClick={() => handleUpdateTeam(unit)}
            className="cursor-pointer object-cover"
            src={`/splash-art/${unit.ImageSource1}`}
            alt={unit.Name}
            fill
            sizes="64px"
          />
        </motion.div>
      </div>
      <div
        className={`flex flex-row items-center ${getBgColor(
          cost
        )} rounded-lg justify-self-center bg-opacity-80 w-fit h-10 p-0.5 pt-5 -mt-4`}
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
