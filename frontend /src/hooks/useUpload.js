import { useState } from "react";
import { apiService } from "@/api/apiService";
import { useFile } from "../contexts/FileContext";

export function useUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setFile, clearFile } = useFile();

  const upload = async (file) => {
    setLoading(true);
    setError(null);
    clearFile();

    try {
      const token = localStorage.getItem("auth_token");

      const uploadRes = await apiService.uploadFile(file, token);

      // Process file
      await apiService.processFile(uploadRes.file_id, token);

      setFile(file, uploadRes);

      return uploadRes;
    } catch (err) {
      setError(err?.message || "Upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}
