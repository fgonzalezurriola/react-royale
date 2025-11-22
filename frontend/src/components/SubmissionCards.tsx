import type { Submission } from '@/types/types'
import { HoverEffect } from './ui/card-hover-effect'

const SubmissionCards = ({ submissions }: { submissions: Submission[] }) => {
  if (!submissions) return null

  const items = submissions.map((submission) => {
    const id = submission.id
    const title = submission.title + ' ' + submission.participantName
    const description = submission.description || ''
    const link = `/hackaton/${submission.hackatonId}/submission/${id}`
    return { id, title, description, link }
  })

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <HoverEffect items={items} />
    </div>
  )
}

export { SubmissionCards }
