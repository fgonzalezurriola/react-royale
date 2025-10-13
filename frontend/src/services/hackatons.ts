import type { Hackaton } from '@/types/types'
import axiosSecure from '@/utils/axiosSecure'

const baseUrl = '/api/hackatons'

const getHackaton = (id: string): Promise<Hackaton> => {
  return axiosSecure
    .get<Hackaton>(`${baseUrl}/${id}`)
    .then((response: { data: Hackaton }) => response.data)
}

const getHackatons = (): Promise<Hackaton[]> => {
  return axiosSecure
    .get<Hackaton[]>(`${baseUrl}`)
    .then((response: { data: Hackaton[] }) => response.data)
}

// Todo: de momento todo usuario podrá crear una, a futuro solo admin
const createHackaton = (data: Hackaton): Promise<Hackaton> => {
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
