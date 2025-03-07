export const getBorderColor = (cost: number) => {
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
