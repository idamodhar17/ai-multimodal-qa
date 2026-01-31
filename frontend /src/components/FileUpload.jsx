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
import { Upload, File, X, Loader2, CheckCircle, FileText, FileAudio, FileVideo, AlertCircle, Cloud } from "lucide-react";

const ALLOWED_EXTENSIONS = [".pdf", ".mp3", ".wav", ".mp4"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const FileUpload = ({ onUploadSuccess }) => {
  const { uploadedFile, clearFile } = useFile();
  const { upload, loading, error } = useUpload();

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");

  const validateFile = (file) => {
    setFileError("");
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size exceeds 50MB limit");
      return false;
    }
    
    // Check file extension
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`File type not supported. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
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
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <File className="h-8 w-8" />;
    
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "mp3":
      case "wav":
        return <FileAudio className="h-8 w-8 text-blue-500" />;
      case "mp4":
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8" />;
    }
  };

  const getFileType = (fileName) => {
    if (!fileName) return "";
    
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "Document";
      case "mp3":
      case "wav":
        return "Audio";
      case "mp4":
        return "Video";
      default:
        return "File";
    }
  };

  return (
    <Card className="border-2 border-transparent hover:border-primary/10 transition-colors shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-semibold">Upload File</span>
            <CardDescription className="text-sm mt-1">
              Upload a document, audio, or video file (Max 50MB)
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!uploadedFile && !selectedFile && (
          <div
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="relative mb-4">
              <Cloud className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <h3 className="font-medium text-sm mb-2">
              {dragActive ? "Drop your file here" : "Drag & drop or click to upload"}
            </h3>
            
            <p className="text-xs text-muted-foreground">
              Supports: PDF, MP3, WAV, MP4 • Max 50MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.mp3,.wav,.mp4"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}

        {/* Selected File Preview */}
        {selectedFile && !uploadedFile && (
          <div className="space-y-4">
            <div className="border rounded-xl p-4 bg-gradient-to-r from-card to-card/50">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                  {getFileIcon(selectedFile.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {getFileType(selectedFile.name)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileError("");
                      }}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {loading && <Progress value={60} className="h-2" />}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedFile(null);
                  setFileError("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={handleUpload}
                disabled={loading}
              >
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
          </div>
        )}

        {/* Uploaded File Success State */}
        {uploadedFile && (
          <div className="border border-green-200 rounded-xl p-4 bg-gradient-to-r from-green-50/50 to-green-50/20">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium truncate">{uploadedFile.filename}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        {uploadedFile.fileType.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ready to chat
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                    onClick={handleClearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {onUploadSuccess && (
                  <div className="mt-3 pt-3 border-t border-green-200/50">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => onUploadSuccess()}
                    >
                      Start asking questions
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {(error || fileError) && (
          <div className="border border-destructive/20 rounded-xl p-4 bg-destructive/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Upload Error</p>
                <p className="text-xs text-destructive/80 mt-1">{error || fileError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 h-7 px-3 text-xs border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setFileError("");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!uploadedFile && !selectedFile && !error && !fileError && (
          <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30">
            <div className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-primary">i</span>
              </div>
              <div>
                <p className="font-medium mb-1">Tips for best results:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                    Ensure files are clear and well-formatted
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                    Audio/video files should have clear speech
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
                    Processing may take a few moments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;