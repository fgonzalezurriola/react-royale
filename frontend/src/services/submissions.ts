import axios from 'axios'
import axiosSecure from '@/utils/axiosSecure'
import type { Submission } from '@/types/types'

const baseUrl = '/api/submissions'

const getSubmission = (hackatonId: string): Promise<Submission> => {
  return axios.get<Submission>(`${baseUrl}/${hackatonId}`).then((response) => response.data)
}

const getSubmissions = (): Promise<Submission[]> => {
  return axios.get<Submission[]>(`${baseUrl}`).then((response) => response.data)
}

type omit = 'id' | 'votes' | 'status' | 'submissionDate'
const createSubmission = (data: Omit<Submission, omit>): Promise<Submission> => {
  return axiosSecure.post<Submission>(`${baseUrl}`, data).then((response) => response.data)
}

const updateSubmission = (id: string, data: Partial<Submission>): Promise<Submission> => {
  return axiosSecure.put<Submission>(`${baseUrl}/${id}`, data).then((response) => response.data)
}

const deleteSubmission = (id: string): Promise<void> => {
  return axiosSecure.delete<void>(`${baseUrl}/${id}`).then((response) => response.data)
}

export const submissionService = {
  getSubmission,
  getSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
}
