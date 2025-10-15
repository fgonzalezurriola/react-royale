export interface Hackaton {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  startVotingDate: Date
  endVotingDate: Date
  votes: number
  imageUrl: string | null
}

export interface Submission {
  id: string
  hackatonId: string
  participantName: string
  participantEmail?: string
  title: string
  description?: string
  jsxCode: string
  submissionDate: Date
  votes: number
  status: 'pending' | 'approved' | 'rejected'
}

export interface UserData {
  id: string
  username: string
  name: string
  submissions: string[]
}

export interface UserProp {
  user: UserData
}

export interface LoginResponse {
  token: string
  username: string
  name: string
}

export type Credentials = {
  username: string
  password: string
}
