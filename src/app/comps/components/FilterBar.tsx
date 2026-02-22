"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SET_CONFIG } from "@/lib/setConfig";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSet = searchParams.get("set") ?? "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("set");
    } else {
      params.set("set", value);
    }
    params.delete("page");
    router.push(`/comps?${params.toString()}`);
  };

  const sets = [
    { key: "all", label: "All Sets" },
    ...Object.entries(SET_CONFIG).map(([key, cfg]) => ({
      key,
      label: cfg.name,
    })),
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {sets.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => handleChange(key)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
            ${
              currentSet === key
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
