import axiosSecure from '@/utils/axiosSecure'
import type { Submission } from '@/types/types'

const baseUrl = '/api/submissions'

const getSubmission = (): Promise<Submission> => {
  return axiosSecure
    .get<Submission>(`${baseUrl}`)
    .then((response) => response.data)
}

const getSubmissions = (hackatonId: string): Promise<Submission[]> => {
  return axiosSecure
    .get<Submission[]>(`${baseUrl}/${hackatonId}`)
    .then((response) => response.data)
}

export const submissionService = {
  getSubmission,
  getSubmissions,
}
