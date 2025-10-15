import { HackatonCards } from '@/components/HackatonCards'
import { Hero } from '@/components/Hero'
import { useHackatons } from '@/hooks/useHackatons'
import * as Separator from '@radix-ui/react-separator'
import { AboutInfo } from './AboutSection'
import { CreateHackatonSection } from './CreateHackatonSection'
import { Archive, Calendar } from 'lucide-react'

export const LandingPage = () => {
  const hackatons = useHackatons()

  const activeHackatons = hackatons.filter((hackaton) => {
    const start = new Date(hackaton.startDate)
    const end = new Date(hackaton.endDate)
    const now = new Date()
    return start <= now && end >= now
  })

  const pastHackatons = hackatons.filter((hackaton) => {
    const end = new Date(hackaton.endDate)
    const now = new Date()
    return end < now
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />

      {/* Features Section */}
      <AboutInfo />

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />

      {/* Create Hackathon CTA */}
      <CreateHackatonSection />

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />

      {/* Active Hackathons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Active hackathons</h2>
            <p className="text-slate-600">Jump in and start building React components</p>
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {activeHackatons.length} Live
          </div>
        </div>
        {activeHackatons.length > 0 ? (
          <HackatonCards hackatons={activeHackatons} />
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No silly competitions running right now</p>
            <p className="text-slate-500 text-sm mt-2">Be the first to create one!</p>
          </div>
        )}
      </section>

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-16" />

      {/* Past Hackathons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="flex items-center gap-3 mb-12">
          <Archive className="w-8 h-8 text-slate-700" />
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Past competitions</h2>
            <p className="text-slate-600">Legendary terrible projects from past competitions</p>
          </div>
        </div>
        {pastHackatons.length > 0 ? (
          <div className="opacity-75">
            <HackatonCards hackatons={pastHackatons} />
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200">
            <Archive className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No legendary fails yet</p>
            <p className="text-slate-500 text-sm mt-2">Be the first to create history!</p>
          </div>
        )}
      </section>
    </div>
  )
}
