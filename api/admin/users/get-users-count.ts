import { getAllInfluencers } from "./get-all-influencers";
import { getAllAgencies } from "./get-all-agencies";
import { getAllBrands } from "./get-all-clients";

export async function getAdminUserCounts() {
  // fetch only 1 item per list but still get meta.total
  const [inf, ag, br] = await Promise.all([
    getAllInfluencers({ page: 1, limit: 1 }),
    getAllAgencies({ page: 1, limit: 1 }),
    getAllBrands({ page: 1, limit: 1 }),
  ]);

  return {
    influencer: inf.meta.total,
    agency: ag.meta.total,
    brand: br.meta.total,
  };
}