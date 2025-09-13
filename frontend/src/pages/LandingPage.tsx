import { Globe } from "@/components/magicui/globe";
import { Marquee } from "@/components/magicui/marquee";

const LandingPage = () => {
  return (
    <>
      <button className="p-2 bg-red-500 text-white rounded">kek</button>
      <Globe className="p-16"></Globe>
      <Marquee className="bg-purple-500 text-white" repeat={24}>
        <span>SILKSONG</span>
      </Marquee>
    </>
  );
};

export default LandingPage;
