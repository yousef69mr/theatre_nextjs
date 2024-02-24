import axios from "axios";

export const logoutRequest = () => {
  return axios.post("/api/auth/logout");
};
