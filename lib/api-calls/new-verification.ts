import axios from "axios";

export const newVerificationRequest = (token: string) => {
  return axios.post("/api/auth/new-verification", {
    token,
  });
};
