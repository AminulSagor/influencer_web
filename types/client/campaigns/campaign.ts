export type Campaign = {
  id: string;
  campaignName: string;
  campaignType: string;
  deadline: string;
  progress: number;
  totalBudget: number;
  assignedTo: {
    name: string;
    image: string | null;
    type: string;
  }[];
};

