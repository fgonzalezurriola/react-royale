import { hackatonService } from '@/services/hackatons'
import type { Hackaton } from '@/types/types'
import { useEffect, useState } from 'react'

const useHackatons = () => {
  const [hackatons, setHackatons] = useState<Hackaton[]>([])

  useEffect(() => {
    hackatonService.getHackatons().then((initialHackatons) => setHackatons(initialHackatons))
  }, [])

  return hackatons
}

export { useHackatons }
