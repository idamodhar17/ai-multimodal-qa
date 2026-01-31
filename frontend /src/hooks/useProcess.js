import { useState } from "react";
import { apiService } from "@/api/apiService";
import { useFile } from "../context/FileContext";

export function useProcess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadedFile } = useFile();

  const processFile = async () => {
    if (!uploadedFile?.fileId) {
      throw new Error("No file to process");
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      return await apiService.processFile(uploadedFile.fileId, token);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { processFile, loading, error };
}
