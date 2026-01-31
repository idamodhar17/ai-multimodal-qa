import React, { createContext, useContext, useState } from "react";

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

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
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
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
