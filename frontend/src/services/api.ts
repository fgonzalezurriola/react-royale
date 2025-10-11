import axios from 'axios'
import type { Hackaton } from '@/types/types'

const baseUrl = '/api/hackatons'

const getHackaton = (id: number): Promise<Hackaton> => {
  return axios
    .get<Hackaton>(`${baseUrl}/${id}`)
    .then((response: { data: Hackaton }) => response.data)
}

const getHackatons = (): Promise<Hackaton[]> => {
  return axios.get<Hackaton[]>(`${baseUrl}`).then((response: { data: Hackaton[] }) => response.data)
}

export const api = {
  getHackaton,
  getHackatons,
}
