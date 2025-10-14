import axios from 'axios'
import axiosSecure from '@/utils/axiosSecure'
import type { Hackaton } from '@/types/types'

const baseUrl = '/api/hackatons'

const getHackaton = (id: string): Promise<Hackaton> => {
  return axios
    .get<Hackaton>(`${baseUrl}/${id}`)
    .then((response: { data: Hackaton }) => response.data)
}

const getHackatons = (): Promise<Hackaton[]> => {
  return axios.get<Hackaton[]>(`${baseUrl}`).then((response: { data: Hackaton[] }) => response.data)
}

// Todo: de momento todo usuario podrá crear una
const createHackaton = (data: Omit<Hackaton, 'id'>): Promise<Hackaton> => {
  return axiosSecure
    .post<Hackaton>(`${baseUrl}`, data)
    .then((response: { data: Hackaton }) => response.data)
}

const updateHackaton = (id: string, data: Partial<Hackaton>): Promise<Hackaton> => {
  return axiosSecure
    .put<Hackaton>(`${baseUrl}/${id}`, data)
    .then((response: { data: Hackaton }) => response.data)
}

const deleteHackaton = (id: string): Promise<void> => {
  return axiosSecure.delete<void>(`${baseUrl}/${id}`).then((response) => response.data)
}

export const hackatonService = {
  getHackaton,
  getHackatons,
  createHackaton,
  updateHackaton,
  deleteHackaton,
}
