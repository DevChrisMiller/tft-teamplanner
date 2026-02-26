"use client";

import Image from "next/image";
import { Unit, Trait } from "@/d";
import { getBgColor } from "@/utils/getBgColor";
import { getBorderColor } from "@/utils/getBorderColor";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/react";

interface Props {
  unit: Unit;
  handleUpdateTeam: (unit: Unit, index: number) => void;
  index: number;
}

export default function UnitLarge({ unit, handleUpdateTeam, index }: Props) {
  return (
    <div
      className={`text-center text-white w-full h-full flex flex-col border-medium rounded-md ${getBorderColor(
        unit.cost
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
            src={unit.imageUrl}
            alt={unit.name}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </motion.div>

        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 to-transparent pt-2 pb-4 px-1">
          <p className="text-sm font-medium text-white drop-shadow-md">
            {unit.name}
          </p>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full ${getBgColor(
            unit.cost
          )} bg-opacity-80 py-1`}
        >
          <div className="flex flex-row w-full justify-center gap-1">
            {unit.traits.map((trait: Trait, i) => (
              <Tooltip key={i} content={trait.name} size="sm" placement="top">
                <Image
                  className="mx-0.5 cursor-default"
                  src={trait.imageUrl}
                  alt={trait.name}
                  height={16}
                  width={16}
                />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
