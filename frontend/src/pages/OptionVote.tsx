import { useState } from 'react'
import { useHackatons } from '@/hooks/useHackatons'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useParams } from 'react-router-dom'
import { LiveEditor, LivePreview, LiveProvider } from 'react-live'

const OptionVote = () => {
  const { id } = useParams()
  const hackatons = useHackatons()
  const hackaton = hackatons.find((hackalike) => hackalike.id == Number(id))

  const { submissions, voteSubmission } = useSubmissions(Number(id))
  const [votedSubmissions, setVotedSubmissions] = useState<Set<number>>(new Set())

  const handleVote = (submissionId: number) => {
    if (votedSubmissions.has(submissionId)) return

    const success = voteSubmission(submissionId)
    if (success) {
      setVotedSubmissions((prev) => new Set([...prev, submissionId]))
    }
  }

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
        <div className="space-y-8">
          <h2 className="text-xl font-semibold">Submissions ({submissions.length})</h2>

          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{submission.title}</h3>
                <p className="text-sm text-gray-600">
                  by {submission.participantName} • {new Date(submission.submissionDate).toLocaleDateString()}
                </p>
                {submission.description && <p className="text-gray-700 mt-2">{submission.description}</p>}
              </div>

              <LiveProvider code={submission.jsxCode} scope={{}}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-semibold mb-2">Code</h4>
                    <LiveEditor disabled />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-semibold mb-2">Preview</h4>
                    <div className="bg-white min-h-48 p-4 rounded border flex items-center justify-center">
                      <LivePreview />
                    </div>
                  </div>
                </div>
              </LiveProvider>

              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Votes: {submission.votes}</span>
                <button
                  onClick={() => handleVote(submission.id)}
                  disabled={votedSubmissions.has(submission.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    votedSubmissions.has(submission.id)
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-400'
                  }`}
                >
                  {votedSubmissions.has(submission.id) ? 'Voted!' : 'Vote'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { OptionVote }
