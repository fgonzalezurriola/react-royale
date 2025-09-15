import { cn } from "@/lib/utils";
import type { Hackaton } from "@/types/types";
import { HoverEffect } from "./ui/card-hover-effect";

const className = cn("group");

const HackatonCard = ({ hackatons }: { hackatons: Hackaton[] }) => {
  const activeHackatons = hackatons.filter((hackaton) => {
    return hackaton.startDate <= new Date() && hackaton.endDate >= new Date();
  });

  if (!activeHackatons || activeHackatons.length === 0) return null;

  const items = activeHackatons.map((hackatons) => ({
    title: hackatons.title,
    description: hackatons.description,
    link: `/hackaton/${hackatons.id}`,
  }));

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <HoverEffect items={items} className={className} />
    </div>
  );
};

export { HackatonCard };
