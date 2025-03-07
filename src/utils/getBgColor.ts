export const getBgColor = (cost: number): string => {
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
