import { useParams, Link, useNavigate } from 'react-router-dom'
import { LiveProvider, LivePreview } from 'react-live'
import { Button } from '@/components/ui/button'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useSubmissionStore } from '@/stores/submissionStore'
import { useShallow } from 'zustand/react/shallow'

const ListSubmissions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const hackaton = useHackatonStore(useShallow((state) => state.hackatons.find((h) => h.id === id)))
  const submissions = useSubmissionStore(
    useShallow((state) => state.submissions.filter((s) => s.hackatonId === id)),
  )

  if (!hackaton) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-400">Hackaton not found</h1>
      </div>
    )
  }

  const now = new Date()
  const endDate = new Date(hackaton.endDate)
  const startVotingDate = new Date(hackaton.startVotingDate)
  const endVotingDate = new Date(hackaton.endVotingDate)

  const isSubmissionPeriod = now >= new Date(hackaton.startDate) && now <= endDate
  const isVotingPeriod = now > endDate && now >= startVotingDate && now <= endVotingDate
  const isHackatonEnded = now > endDate

  return (
    <div className="p-6">
      <Button
        className="mb-4 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        onClick={() => navigate('/')}
      >
        {' '}
        ← Return home
      </Button>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">{hackaton.title}</h1>
          <p className="text-gray-700">{hackaton.description}</p>
          <p className="mb-6 text-gray-700">
            Fecha de cierre: {new Date(hackaton.endDate).toLocaleDateString('en-GB')}
          </p>
          {(isVotingPeriod || now > endVotingDate) && (
            <Button onClick={() => navigate('results')}>Show votes</Button>
          )}
        </div>
        {!isHackatonEnded && (
          <Button onClick={() => navigate('submit')}>Participate with a component</Button>
        )}
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 mt-8">
          {isSubmissionPeriod ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions yet</h2>
              <p className="text-slate-600 mb-6">Be the first to submit your JSX component!</p>
              <Button onClick={() => navigate('submit')}>Submit Your Entry</Button>
            </>
          ) : isVotingPeriod ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions</h2>
              <p className="text-slate-600">
                Unfortunately, no one participated in this hackathon during the submission period.
              </p>
              <p className="text-slate-500 mt-2">Nothing to vote on!</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No submissions</h2>
              <p className="text-slate-600">This hackathon ended without any submissions.</p>
            </>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-6">Submissions ({submissions.length})</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Link
                key={submission.id}
                to={`/hackaton/${id}/submission/${submission.id}`}
                className="border rounded-2xl p-4 bg-white shadow-md flex flex-col hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-1">{submission.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  by {submission.participantName} •{' '}
                  {new Date(submission.submissionDate).toLocaleDateString()}
                </p>

                <LiveProvider code={submission.jsxCode} scope={{}}>
                  <div className="bg-gray-50 p-4 rounded-lg border flex items-center justify-center min-h-40 mb-4">
                    <LivePreview />
                  </div>
                </LiveProvider>

                {submission.description && (
                  <p className="text-gray-700 text-sm line-clamp-3">{submission.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export { ListSubmissions }
