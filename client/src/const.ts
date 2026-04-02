export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL for Google OAuth
export const getLoginUrl = () => {
  return "/api/auth/google";
};
