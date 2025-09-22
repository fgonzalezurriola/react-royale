import { useHackatons } from '@/hooks/useHackatons'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useParams, Link } from 'react-router-dom'
import { LiveProvider, LivePreview } from 'react-live'

const ListSubmissions = () => {
  const { id } = useParams()
  const hackatons = useHackatons()
  const hackaton = hackatons.find((hackalike) => hackalike.id == Number(id))

  const { submissions } = useSubmissions(Number(id))

  if (!hackaton) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-400">Hackaton not found</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{hackaton.title}</h1>
      <p className="mb-6 text-gray-700">{hackaton.description}</p>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">No submissions found for this hackaton</h2>
          <p className="text-gray-500 mt-2">Be the first to submit your JSX component!</p>
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
