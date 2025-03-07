import Image from "next/image";
import { Unit, Trait } from "@/d";
import { getBgColor } from "@/utils/getBgColor";
import { getBorderColor } from "@/utils/getBorderColor";
import { motion } from "framer-motion";

interface Props {
  unit: Unit;
  handleUpdateTeam: (unit: Unit, index: number) => void;
  index: number;
}

export default function UnitLarge({ unit, handleUpdateTeam, index }: Props) {
  return (
    <div
      className={`text-center text-white w-full h-full flex flex-col border-medium rounded-md ${getBorderColor(
        unit.Cost
      )} cursor-pointer`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-md">
        <motion.div
          className="w-full h-full"
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.3 },
          }}
          onClick={() => handleUpdateTeam(unit, index)}
        >
          <Image
            className="object-cover"
            src={`/splash-art/${unit.ImageSource1}`}
            alt={unit.Name}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </motion.div>

        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent pt-2 pb-4 px-1">
          <p className="text-sm font-medium text-white drop-shadow-md">
            {unit.Name}
          </p>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full ${getBgColor(
            unit.Cost
          )} bg-opacity-80 py-1`}
        >
          <div className="flex flex-row w-full justify-center gap-1">
            {unit.Traits?.map((trait: Trait, i) => {
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
        </div>
      </div>
    </div>
  );
}
