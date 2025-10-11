import type { Hackaton } from '@/types/types'
import { HoverEffect } from './ui/card-hover-effect'

const HackatonCards = ({ hackatons }: { hackatons: Hackaton[] }) => {
  const items = hackatons.map((hackatons) => ({
    title: hackatons.title,
    description: hackatons.description,
    link: `/hackaton/${hackatons.id}`,
  }))

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <HoverEffect items={items} />
    </div>
  )
}

export { HackatonCards }
