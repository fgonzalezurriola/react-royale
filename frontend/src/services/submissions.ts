import axiosSecure from '@/utils/axiosSecure'
import { Submission } from '@/types/submission'

const baseUrl = '/api/submissions'

const getSumbission = (hackatonId: string): Promise<Submission> => {
  return axiosSecure
    .get<Submission>(`${baseUrl}`)
    .then((response: { data: Submission }) => response.data)
}

const getSubmissions = (hackatonId: string): Promise<Submission[]> => {
  return axiosSecure
    .get<Submission>(`${baseUrl}/${hackatonId}`)
    .then((response: { data: Submission[] }) => response.data)
}

export const submissionService = {
  getSumbission,
  getSubmissions,
}
