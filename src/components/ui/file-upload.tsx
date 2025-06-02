import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 20,
  maxSize = 18 * 1024 * 1024, // 18MB
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
  },
  multiple = true,
  disabled = false,
  className,
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>(
    [],
  );
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      });

      setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [maxFiles],
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);

      // Simulate upload progress
      selectedFiles.forEach((file, index) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));

          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      });
    }
  };

  const clearFiles = () => {
    selectedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    setUploadProgress({});
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled,
    maxFiles,
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          {
            "border-primary bg-primary/5": isDragActive && !isDragReject,
            "border-destructive bg-destructive/5": isDragReject,
            "border-border hover:border-primary/50": !isDragActive && !disabled,
            "opacity-50 cursor-not-allowed": disabled,
          },
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <div>
            <p className="text-lg font-medium">
              {isDragActive
                ? "Drop the files here..."
                : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to select files ({multiple ? "multiple" : "single"} files
              allowed)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFiles} files, {(maxSize / (1024 * 1024)).toFixed(0)}MB
              each (18MB limit)
            </p>
          </div>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <h4 className="font-medium text-destructive mb-2">
            Some files were rejected:
          </h4>
          <ul className="text-sm text-destructive space-y-1">
            {fileRejections.map(({ file, errors }) => (
              <li key={file.name}>
                {file.name}: {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="flex gap-2">
              <Button onClick={handleUpload} size="sm">
                Upload All
              </Button>
              <Button onClick={clearFiles} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-muted">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  {uploadProgress[file.name] && (
                    <div className="mt-2">
                      <Progress
                        value={uploadProgress[file.name]}
                        className="h-1"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => removeFile(index)}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
