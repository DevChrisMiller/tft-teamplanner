"use client";

import Image from "next/image";
import { Unit } from "@/d";
import { motion } from "framer-motion";
import { getBorderColor } from "@/utils/getBorderColor";
import { getBgColor } from "@/utils/getBgColor";
import { Tooltip } from "@nextui-org/react";

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
          unit.cost
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
            src={unit.iconUrl}
            alt={unit.name}
            fill
            sizes="64px"
          />
        </motion.div>
      </div>
      <div
        className={`flex flex-row items-center justify-center ${getBgColor(
          cost
        )} rounded-lg mx-auto bg-opacity-80 w-fit h-10 p-0.5 pt-5 -mt-4`}
      >
        {unit.traits.map((trait, i) => (
          <Tooltip key={i} content={trait.name} size="sm" placement="bottom">
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
      <p className="text-xs break-normal">{unit.name}</p>
    </div>
  );
}
