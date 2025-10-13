import type { Submission } from '@/types/types'
import { useEffect, useState } from 'react'

const useSubmissions = (hackatonId?: string) => {
  const [submissions, setSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    if (!hackatonId) return

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:3001/submissions?hackatonId=${hackatonId}`)
        const data = await response.json()
        setSubmissions(data)
      } catch (error) {
        console.error('Error fetching submissions:', error)
      }
    }

    fetchSubmissions()
  }, [hackatonId])

  const voteSubmission = (submissionId: string): boolean => {
    const submission = submissions.find((s) => s.id === submissionId)
    if (!submission) return false

    const updatedSubmission = { ...submission, votes: submission.votes + 1 }

    // Todo hito 2 actualizar en backend, hacer backend
    setSubmissions((prev) => prev.map((s) => (s.id === submissionId ? updatedSubmission : s)))

    return true
  }

  return {
    submissions,
    voteSubmission,
  }
}

export { useSubmissions }
