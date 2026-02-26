"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SET_CONFIG, DEFAULT_SET_KEY } from "@/lib/setConfig";

const SORT_OPTIONS = [
  { key: "top", label: "Top" },
  { key: "new", label: "New" },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSet = searchParams.get("set") ?? DEFAULT_SET_KEY;
  const currentSort = searchParams.get("sort") ?? "top";

  const navigate = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    router.push(`/comps?${params.toString()}`);
  };

  const handleSetChange = (value: string) => {
    navigate({ set: value === DEFAULT_SET_KEY ? null : value });
  };

  const handleSortChange = (value: string) => {
    navigate({ sort: value === "top" ? null : value });
  };

  const sets = [
    ...Object.entries(SET_CONFIG).map(([key, cfg]) => ({
      key,
      label: cfg.name,
    })),
    { key: "all", label: "All Sets" },
  ];

  const chipClass = (active: boolean) =>
    `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
    }`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSortChange(key)}
            className={chipClass(currentSort === key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {sets.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSetChange(key)}
            className={chipClass(currentSet === key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
