import { HackatonCards } from "@/components/HackatonCards";
import { Hero } from "@/components/Hero";
import { useHackatons } from "@/hooks/useHackatons";

const LandingPage = () => {
  const hackatons = useHackatons();

  const activeHackatons = hackatons.filter((hackaton) => {
    const start = new Date(hackaton.startDate);
    const end = new Date(hackaton.endDate);
    const now = new Date();
    return start <= now && end >= now;
  });

  return (
    <div className="min-h-screen">
      <Hero />
      <HackatonCards hackatons={activeHackatons} />
    </div>
  );
};

export default LandingPage;
