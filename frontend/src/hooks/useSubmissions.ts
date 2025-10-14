import { submissionService } from '@/services/submissions'
import type { Submission } from '@/types/types'
import { useEffect, useState } from 'react'

const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([])

  useEffect(() => {
    submissionService
      .getSubmissions()
      .then((initialSubmissions) => setSubmissions(initialSubmissions))
  }, [])

  return submissions
}

export { useSubmissions }
