import axios from "axios";

export const getAllPlaysRequest = async () => {
  const response = await axios.get("/api/plays");
  return response.data;
};

export const getPlayByIdRequest = async (playId: string) => {
  const response = await axios.get(`/api/plays/${playId}`);
  return response.data;
};
