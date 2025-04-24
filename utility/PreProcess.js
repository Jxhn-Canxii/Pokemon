import { encryptData } from "./AES";
import { VUE_APP_API_URL } from "./Global";
import { FormDx, handleApiError, BearToken } from "./Helper";
import axios from "axios";

export const getPermissions = async (token = "") => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}users/get-user-permissions`,
      formData,
      BearToken(token)
    );
    if (response) {
      // Encrypt the permissions data before storing it
      const encryptedData = encryptData(response.data.permissions);
      // Ensure localStorage is only accessed on the client side
      if (import.meta.client) {
        localStorage.setItem("pe-001", encryptedData);
      }
    }
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return []; // Handle errors as needed
  }
};

export const getRoles = async (token = "") => {
  try {
    const formData = FormDx({ id: 0 });
    const response = await axios.post(
      `${VUE_APP_API_URL}roles/all-roles-dropdown`,
      formData,
      BearToken(token)
    );
    if (response) {
      const encryptedData = encryptData(response.data.roles);
      // Ensure localStorage is only accessed on the client side
      if (import.meta.client) {
        localStorage.setItem("ro-001", encryptedData);
      }
    }
  } catch (error) {
    console.error("Error fetching list roles:", error);
    return []; // Handle errors as needed
  }
};
