import { HackatonCards } from '@/components/HackatonCards'
import { Hero } from '@/components/Hero'
import * as Separator from '@radix-ui/react-separator'
import { AboutSection } from './AboutSection'
import { CreateHackatonSection } from './CreateHackatonSection'
import { Archive, Calendar, Vote } from 'lucide-react'
import { useHackatonStore } from '@/stores/hackatonStore'

export const LandingPage = () => {
  const hackatons = useHackatonStore((state) => state.hackatons)

  const activeHackatons = hackatons.filter((hackaton) => {
    const start = new Date(hackaton.startDate)
    const end = new Date(hackaton.endDate)
    const now = new Date()
    return start <= now && end >= now
  })

  const votingHackatons = hackatons.filter((hackaton) => {
    const endDate = new Date(hackaton.endDate)
    const startVoting = new Date(hackaton.startVotingDate)
    const endVoting = new Date(hackaton.endVotingDate)
    const now = new Date()
    return endDate < now && startVoting <= now && endVoting >= now
  })

  const pastHackatons = hackatons.filter((hackaton) => {
    const endVoting = new Date(hackaton.endVotingDate)
    const now = new Date()
    return endVoting < now
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-8" />

      {/* Features Section */}
      <AboutSection />

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
            <p className="text-slate-600 text-lg">No competitions running right now</p>
            <p className="text-slate-500 text-sm mt-2">Be the first to create one!</p>
          </div>
        )}
      </section>

      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-16" />

      {/* Voting Period Hackathons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Voting period</h2>
            <p className="text-slate-600">Cast your votes for the best submissions</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
            <Vote className="w-4 h-4" />
            {votingHackatons.length} Voting
          </div>
        </div>
        {votingHackatons.length > 0 ? (
          <HackatonCards hackatons={votingHackatons} />
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <Vote className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No hackathons in voting period</p>
            <p className="text-slate-500 text-sm mt-2">Check back soon!</p>
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
            <p className="text-slate-600 text-lg">There is no record of past hackatons</p>
            <p className="text-slate-500 text-sm mt-2">Be the first to create history!</p>
          </div>
        )}
      </section>
    </div>
  )
}
