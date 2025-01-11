export default function NewTeamContainer() {
  const unitPlaceholders = 10;

  return (
    <>
      <div className="grid grid-cols-5 gap-4 m-2 h-fit w-full">
        {[...Array(unitPlaceholders)].map((unit, i) => {
          return (
            <div
              key={i}
              className="flex items-center justify-center w-26 h-40 rounded-md bg-neutral-800"
            >
              <span className="text-neutral-600">{i + 1}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
