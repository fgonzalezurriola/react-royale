import { useParams, Link } from 'react-router-dom'
import { useHackatons } from '@/hooks/useHackatons'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useState } from 'react'
import { LiveProvider, LiveEditor, LivePreview } from 'react-live'

const SubmissionDetail = () => {
  const { id, submissionId } = useParams()
  const hackatons = useHackatons()
  const hackaton = hackatons.find((h) => h.id == id)

  const { submissions, voteSubmission } = useSubmissions(id)
  const submission = submissions.find((s) => s.id == submissionId)

  const [voted, setVoted] = useState(false)

  const handleVote = () => {
    if (voted) return
    if (!submissionId) return
    const success = voteSubmission(submissionId)
    if (success) setVoted(true)
  }

  if (!hackaton || !submission) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-400">Submission not found</h1>
        <Link
          to={`/hackaton/${id}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          ← Back to Submissions
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link
        to={`/hackaton/${id}`}
        className="mb-4 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        ← Back to Submissions
      </Link>

      <h1 className="text-2xl font-bold mb-2">{submission.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        by {submission.participantName} • {new Date(submission.submissionDate).toLocaleDateString()}
      </p>
      {submission.description && <p className="text-gray-700 mb-6">{submission.description}</p>}

      <LiveProvider code={submission.jsxCode} scope={{}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Code</h4>
            <LiveEditor disabled className="min-h-60" />
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Preview</h4>
            <div className="bg-white min-h-60 p-4 rounded border flex items-center justify-center">
              <LivePreview />
            </div>
          </div>
        </div>
      </LiveProvider>

      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Votes: {submission.votes + (voted ? 1 : 0)}</span>
        <button
          onClick={handleVote}
          disabled={voted}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            voted
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-400'
          }`}
        >
          {voted ? 'Voted!' : 'Vote'}
        </button>
      </div>
    </div>
  )
}

export { SubmissionDetail }
