export interface Hackaton {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startVotingDate: Date;
  endVotingDate: Date;
  votes: number;
  imageUrl: string | null;
}
