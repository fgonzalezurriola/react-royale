export interface Hackaton {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startVotingDate: Date;
  endVotingDate: Date;
  imageUrl: string | null;
}
