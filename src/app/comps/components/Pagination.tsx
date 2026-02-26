"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  page: number;
  totalPages: number;
  total: number;
}

export default function Pagination({ page, totalPages, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    router.push(`/comps?${params.toString()}`);
  };

  const btnClass = (disabled: boolean) =>
    `flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      disabled
        ? "text-neutral-600 cursor-not-allowed"
        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
    }`;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => navigate(page - 1)}
        disabled={page <= 1}
        className={btnClass(page <= 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
        Prev
      </button>

      <span className="text-sm text-neutral-400">
        {page} / {totalPages} &mdash; {total} comps
      </span>

      <button
        onClick={() => navigate(page + 1)}
        disabled={page >= totalPages}
        className={btnClass(page >= totalPages)}
      >
        Next
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
      </button>
    </div>
  );
}
