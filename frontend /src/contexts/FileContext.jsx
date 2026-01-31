import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      clearFile();
    }
  }, [isAuthenticated]);

  const setFile = (file, apiResponse) => {
    const url = URL.createObjectURL(file);

    setUploadedFile({
      file,
      url,
      fileId: apiResponse.file_id,
      filename: apiResponse.filename,
      fileType: apiResponse.file_type,
    });
  };

  const clearFile = () => {
    setUploadedFile((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  };

  return (
    <FileContext.Provider
      value={{
        uploadedFile,
        setFile,
        clearFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within FileProvider");
  }
  return context;
};
