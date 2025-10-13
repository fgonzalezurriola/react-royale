import axios from 'axios'
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

export const hackatonService = {
  getHackaton,
  getHackatons,
}
