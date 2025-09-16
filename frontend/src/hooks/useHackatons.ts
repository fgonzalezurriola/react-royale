import { api } from "@/services/api";
import type { Hackaton } from "@/types/types";
import { useEffect, useState } from "react";

const useHackatons = () => {
  const [hackatons, setHackatons] = useState<Hackaton[]>([]);

  useEffect(() => {
    api.getHackatons().then((initialHackatons) => setHackatons(initialHackatons));
  }, []);

  return hackatons;
};

export { useHackatons };
