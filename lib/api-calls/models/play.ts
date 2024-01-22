import axios from "axios";

export const getAllPlaysRequest = async () => {
  try {
    const response = await axios.get("/api/plays");
    return response.data;
  } catch (error) {
    return [];
  }
};

export const getPlayByIdRequest = async (playId: string) => {
  try {
    const response = await axios.get(`/api/plays/${playId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
