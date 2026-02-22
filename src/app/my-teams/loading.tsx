export default function MyTeamsLoading() {
  return (
    <main className="w-full py-6 flex flex-col gap-6">
      <div className="h-8 w-32 bg-neutral-800 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-neutral-900 rounded-2xl p-4 h-48 animate-pulse" />
        ))}
      </div>
    </main>
  );
}
