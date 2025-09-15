import { HackatonCard } from "@/components/HackatonCard";
import { Hero } from "@/components/Hero";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HackatonCard hackatons={[]} />
    </div>
  );
};

export default LandingPage;
