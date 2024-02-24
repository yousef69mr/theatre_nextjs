import axios from "axios";

export const getUserByEmailRequest = async (email: string) => {
  try {
    const response = await axios.get(`/api/users/${email}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUserByIdRequest = async (id: string) => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteUserByIdRequest = async (id: string) => {
  try {
    const response = await axios.delete(`/api/users/${id}`);
    // return response.data

    return { success: "Deleted successfully!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
