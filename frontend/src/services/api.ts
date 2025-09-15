import axios from "axios";
import { Hackaton } from "@/types/types";

const baseUrl = "http://localhost:3000/hackatons";

// Idea entidad hackatones y cada hackaton tiene los codeSubmit(nombre provisional)

const getHackaton = (id: number): Promise<Hackaton[]> => {
  return axios.get<Hackaton[]>(`${baseUrl}/${id}`).then((response: { data: Hackaton[] }) => response.data);
};

const getHackatons = (id: number): Promise<Hackaton[]> => {
  return axios.get<Hackaton[]>(`${baseUrl}/${id}`).then((response: { data: Hackaton[] }) => response.data);
};
