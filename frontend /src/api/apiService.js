import { apiClient } from "./apiClient";
import API_ENDPOINTS from "./apiEnums";

export const apiService = {
  login(payload) {
    return apiClient(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: payload,
    });
  },

  register(payload) {
    return apiClient(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: payload,
    });
  },

  uploadFile(file, token) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient(API_ENDPOINTS.UPLOAD, {
      method: "POST",
      body: formData,
      token,
    });
  },

  processFile(fileId, token) {
    return apiClient(API_ENDPOINTS.PROCESS(fileId), {
      method: "POST",
      token,
    });
  },

  chat(question, fileId, token) {
    return apiClient(API_ENDPOINTS.CHAT, {
      method: "POST",
      body: {
        question,
        file_id: fileId,
      },
      token,
    });
  },
};
