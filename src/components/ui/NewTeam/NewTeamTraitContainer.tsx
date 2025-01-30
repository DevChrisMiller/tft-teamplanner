import Image from "next/image";

export default function NewTeamTraitContainer() {
  const emptyTraits = 10;
  //implement ternary based on selectedUnits state
  return (
    <>
      <div className="flex flex-col flex-shrink-0 min-w-32 h-full overflow-y-auto no-scrollbar">
        {[...Array(emptyTraits)].map((e, i) => {
          return (
            <div className="flex flex-row m-2" key={i}>
              <Image
                className="mr-1"
                src="/traits/empty_trait.avif"
                alt="empty trait"
                height={12}
                width={32}
              />
              <div className="flex flex-col gap-1">
                <div className="w-16 h-4 rounded-sm bg-neutral-800"></div>
                <div className="w-8 h-4 rounded-sm bg-neutral-800"></div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
