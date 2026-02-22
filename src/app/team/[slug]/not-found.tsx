import Link from "next/link";

export default function TeamNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
      <p className="text-2xl font-bold">Team not found</p>
      <p className="text-neutral-400">
        This team either doesn&apos;t exist or is private.
      </p>
      <Link href="/" className="text-blue-400 hover:text-blue-300">
        Go back home
      </Link>
    </div>
  );
}
