import React, { useRef, useState } from "react";
import { useFile } from "../contexts/FileContext";
import { useUpload } from "@/hooks/useUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, Loader2, CheckCircle } from "lucide-react";

const ALLOWED_EXTENSIONS = [".pdf", ".mp3", ".wav", ".mp4"];

const FileUpload = ({ onUploadSuccess }) => {
  const { uploadedFile, clearFile } = useFile();
  const { upload, loading, error } = useUpload();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const validateFile = (file) => {
    const ext = "." + file.name.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await upload(selectedFile);
    setSelectedFile(null);
    onUploadSuccess?.();
  };

  const handleClearFile = () => {
    clearFile();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload File</CardTitle>
        <CardDescription>
          Upload a document, audio, or video file
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!uploadedFile && !selectedFile && (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-10 w-10 mb-4" />
            <p className="text-sm">Click to upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.mp3,.wav,.mp4"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}

        {selectedFile && !uploadedFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <File className="h-8 w-8" />
              <div className="flex-1">
                <p className="text-sm truncate">{selectedFile.name}</p>
                <p className="text-xs">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {loading && <Progress value={60} />}

            <Button className="w-full" onClick={handleUpload} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        )}

        {uploadedFile && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm truncate">{uploadedFile.filename}</p>
              <p className="text-xs">
                {uploadedFile.fileType.toUpperCase()}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
