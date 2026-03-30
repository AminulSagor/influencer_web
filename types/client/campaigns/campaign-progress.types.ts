export type AgencyCampaignProgressData = {
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
};

export type InfluencerCampaignProgressData = {
  totalAssignedMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
};

export type CampaignOverallProgress = {
  progressPercentage: number;
};