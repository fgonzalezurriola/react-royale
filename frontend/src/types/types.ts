export interface Hackaton {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startVotingDate: string
  endVotingDate: string
  host: string
}

export interface Submission {
  id: string
  hackatonId: string
  userId: string
  participantName: string
  title: string
  description?: string
  jsxCode: string
  submissionDate: Date
  votes: number
  hasVoted: boolean
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
