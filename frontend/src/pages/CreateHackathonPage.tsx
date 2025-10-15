import { HackatonForm } from '@/components/HackatonForm'
import { Highlight } from '@/components/ui/hero-highlight'
import type { UserProp } from '@/types/types'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const CreateHackathonPage = ({ user }: UserProp) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Link
        to="/"
        className="p-12 inline-flex items-center gap-4 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          {/* Title Section */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="gap-4 mb-4">
                <h1 className="text-6xl font-bold text-center">
                  Create a{' '}
                  <Highlight className="bg-gradient-to-tr from-yellow-100 to-yellow-500">
                    Hackaton
                  </Highlight>
                </h1>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-4">Competition Details</h2>
            <p className="text-slate-600">
              Fill in the details for your ridiculous hackathon challenge
            </p>
          </div>

          {user ? (
            <HackatonForm user={user} />
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Login Required</h3>
              <p className="text-slate-600 mb-6">You need to be logged in to create a hackathon</p>
              <Link to="/login">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                  Login to Continue
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {user && (
          <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>
                  Make the challenge hilariously specific (e.g., "Build a login form with at least
                  20 unnecessary animations")
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Give participants enough time to overthink</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>
                  Schedule voting period after submissions close to let the community decide the
                  winner
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Remember: the goal is to have fun and celebrate creative chaos!</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateHackathonPage
