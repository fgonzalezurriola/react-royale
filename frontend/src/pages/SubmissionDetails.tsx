import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LiveProvider, LiveEditor, LivePreview } from 'react-live'
import React from 'react'
import { useHackatonStore } from '@/stores/hackatonStore'
import { useSubmissionStore } from '@/stores/submissionStore'
import { useAuthStore } from '@/stores/authStore'
import { useShallow } from 'zustand/react/shallow'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const SubmissionDetail = () => {
  const { id, submissionId } = useParams()
  const user = useAuthStore((state) => state.user)
  const [showChangeVoteDialog, setShowChangeVoteDialog] = useState(false)
  const [previousVote, setPreviousVote] = useState<{ id: string; title: string } | null>(null)

  const hackaton = useHackatonStore(useShallow((state) => state.hackatons.find((h) => h.id === id)))
  const submission = useSubmissionStore(
    useShallow((state) => state.submissions.find((s) => s.id === submissionId)),
  )

  const hasVoted = submission?.hasVoted || false

  // Check if voting period is active
  const now = new Date()
  const endDate = hackaton ? new Date(hackaton.endDate) : null
  const startVotingDate = hackaton ? new Date(hackaton.startVotingDate) : null
  const endVotingDate = hackaton ? new Date(hackaton.endVotingDate) : null
  const isVotingPeriod =
    endDate &&
    startVotingDate &&
    endVotingDate &&
    now > endDate &&
    now >= startVotingDate &&
    now <= endVotingDate

  const handleVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote')
      return
    }
    if (!isVotingPeriod) {
      toast.error('Voting is not currently open for this competition')
      return
    }
    if (hasVoted) return
    if (!submissionId) return

    try {
      await useSubmissionStore.getState().voteSubmission(submissionId)
      toast.success('Vote recorded!')
      // Refetch submissions to update vote counts
      await useSubmissionStore.getState().fetchSubmissions()
    } catch (error: any) {
      // Check if error is because user already voted
      const errorData = error.response?.data

      if (errorData && 'previousVote' in errorData && errorData.previousVote) {
        setPreviousVote(errorData.previousVote)
        setShowChangeVoteDialog(true)
      } else {
        toast.error(errorData?.error || 'Failed to vote')
      }
    }
  }

  const handleChangeVote = async () => {
    if (!submissionId) return

    try {
      await useSubmissionStore.getState().voteSubmission(submissionId, true)
      toast.success('Vote changed successfully!')
      setShowChangeVoteDialog(false)
      setPreviousVote(null)
      // Refetch submissions to update vote counts
      await useSubmissionStore.getState().fetchSubmissions()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change vote')
    }
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

      <LiveProvider code={submission.jsxCode} scope={{ React }}>
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

      {(isVotingPeriod || (endVotingDate && now > endVotingDate)) && (
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Votes: {submission.votes}</span>
          {isVotingPeriod && (
            <button
              onClick={handleVote}
              disabled={hasVoted || !user}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasVoted || !user
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-400'
              }`}
            >
              {!user ? 'Login to Vote' : hasVoted ? 'Voted!' : 'Vote'}
            </button>
          )}
        </div>
      )}

      <AlertDialog open={showChangeVoteDialog} onOpenChange={setShowChangeVoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Your Vote?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to change your vote from <strong>"{previousVote?.title}"</strong> to{' '}
              <strong>"{submission.title}"</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleChangeVote}>Change Vote</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { SubmissionDetail }
