// service/auth/logout.ts

import { removeToken } from "@/utils/cookies_util";

export const logout = async () => {
  // Clear the authentication token from cookies
  removeToken();
  
  // Note: Backend logout endpoint not available, using client-side token removal only
  // If backend implements /influencer/auth/logout in the future, add API call here
};
