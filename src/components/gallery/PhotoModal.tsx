import React from "react";
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Camera,
} from "lucide-react";
import { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface PhotoModalProps {
  photo: Photo | null;
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (photo: Photo) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  photos,
  isOpen,
  onClose,
  onDownload,
  onPrevious,
  onNext,
}) => {
  const { isAuthenticated } = useAuth();

  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleDownload = async () => {
    if (!onDownload || !isAuthenticated) return;

    try {
      const link = document.createElement("a");
      link.href = photo.url;
      link.download = photo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onDownload(photo);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Image area */}
          <div className="flex-1 relative bg-black flex items-center justify-center">
            <img
              src={photo.url}
              alt={photo.filename}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation buttons */}
            {hasPrevious && onPrevious && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={onPrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}

            {hasNext && onNext && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={onNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 bg-black/50 p-4 flex justify-between items-center">
              <div className="text-white">
                <h2 className="font-medium">{photo.filename}</h2>
                <p className="text-sm text-white/70">
                  {currentIndex + 1} of {photos.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isAuthenticated && onDownload && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Face detection overlay */}
            {photo.faces.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {photo.faces.map((face, index) => (
                  <div
                    key={face.id}
                    className="absolute border-2 border-red-500 bg-red-500/20"
                    style={{
                      left: `${(face.boundingBox.x / (photo.dimensions?.width || 1)) * 100}%`,
                      top: `${(face.boundingBox.y / (photo.dimensions?.height || 1)) * 100}%`,
                      width: `${(face.boundingBox.width / (photo.dimensions?.width || 1)) * 100}%`,
                      height: `${(face.boundingBox.height / (photo.dimensions?.height || 1)) * 100}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                      Face {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-background border-l p-6 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Photo Details</h3>

            <div className="space-y-4">
              {/* Basic info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">File Information</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{formatFileSize(photo.fileSize)}</span>
                  </div>
                  {photo.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>
                        {photo.dimensions.width} × {photo.dimensions.height}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Upload info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Upload Information
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span>{formatDate(photo.uploadedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">By:</span>
                    <span>{photo.uploadedBy}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Face detection */}
              {photo.faces.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Faces Detected ({photo.faces.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {photo.faces.map((face, index) => (
                      <div key={face.id} className="p-2 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Face {index + 1}
                          </span>
                          <Badge variant="outline">
                            {Math.round(face.confidence * 100)}%
                          </Badge>
                        </div>
                        {face.personId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Person ID: {face.personId}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {photo.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
