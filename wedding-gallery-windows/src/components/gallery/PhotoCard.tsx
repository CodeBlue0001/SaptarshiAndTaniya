import React from "react";
import { Download, Eye, MoreVertical, Trash2, User } from "lucide-react";
import { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  photo: Photo;
  onView: (photo: Photo) => void;
  onDownload?: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
  className?: string;
  showActions?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onView,
  onDownload,
  onDelete,
  className,
  showActions = true,
}) => {
  const { isAuthenticated } = useAuth();

  const handleDownload = async () => {
    if (!onDownload) return;

    try {
      // In a real app, you'd handle proper file downloads
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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-square">
        <img
          src={photo.thumbnailUrl}
          alt={photo.filename}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => onView(photo)}
          loading="lazy"
        />

        {/* Face count indicator */}
        {photo.faces.length > 0 && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-black/70 text-white hover:bg-black/70"
          >
            <User className="w-3 h-3 mr-1" />
            {photo.faces.length}
          </Badge>
        )}

        {/* Actions overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(photo)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {isAuthenticated && onDownload && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}

            {isAuthenticated && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(photo)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Photo info */}
      <div className="p-3">
        <h4 className="font-medium text-sm truncate" title={photo.filename}>
          {photo.filename}
        </h4>
        <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
          <span>{formatFileSize(photo.fileSize)}</span>
          <span>{formatDate(photo.uploadedAt)}</span>
        </div>

        {photo.dimensions && (
          <div className="text-xs text-muted-foreground mt-1">
            {photo.dimensions.width} × {photo.dimensions.height}
          </div>
        )}

        {photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {photo.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {photo.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{photo.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
