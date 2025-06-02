import React from "react";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { StorageMonitor } from "@/components/gallery/StorageMonitor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Lock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { galleryService } from "@/services/galleryService";
import { faceDetectionService } from "@/services/faceDetectionService";
import { useToast } from "@/hooks/use-toast";

export default function Gallery() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [photos, setPhotos] = React.useState([]);
  const [persons, setPersons] = React.useState([]);
  const [folders, setFolders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [storageInfo, setStorageInfo] = React.useState({
    used: 0,
    limit: 0,
    percentage: 0,
  });

  React.useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    setIsLoading(true);
    try {
      // Load photos
      const loadedPhotos = galleryService.getPhotos();
      setPhotos(loadedPhotos);

      // Load persons
      const loadedPersons = faceDetectionService.getPersons();
      setPersons(loadedPersons);

      // Load folders
      const loadedFolders = galleryService.getFolders();
      setFolders(loadedFolders);

      // Calculate storage info
      const used = galleryService.getStorageUsed();
      const limit = galleryService.getStorageLimit();
      setStorageInfo({
        used,
        limit,
        percentage: (used / limit) * 100,
      });
    } catch (error) {
      console.error("Failed to load gallery data:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (photo) => {
    toast({
      title: "Download started",
      description: `Downloading ${photo.filename}...`,
    });
  };

  const handleDelete = async (photo) => {
    try {
      await galleryService.deletePhoto(photo.id);
      await loadGalleryData(); // Reload data
      toast({
        title: "Photo deleted",
        description: `${photo.filename} has been removed from the gallery.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatStorageSize = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gallery Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Wedding Photo Gallery</h1>
            <p className="text-muted-foreground mb-4">
              {isAuthenticated
                ? "Manage and view all your wedding photos with AI-powered organization."
                : "Browse our beautiful collection of wedding photos. Sign in to upload and download."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {photos.length} Photos
              </Badge>
              <Badge variant="outline">{persons.length} People Detected</Badge>
              <Badge variant="outline">{folders.length} Folders</Badge>

              {!isAuthenticated && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Limited Access
                </Badge>
              )}
            </div>
          </div>

          {/* Storage Info & Actions */}
          <div className="lg:w-80">
            <Card>
              <CardContent className="p-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <StorageMonitor onClearCache={loadGalleryData} />

                    <Button asChild className="w-full">
                      <Link to="/upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photos
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Limited Access</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Sign in to upload photos and access download features
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      {photos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {isAuthenticated
                ? "Start building your wedding gallery by uploading your first photos."
                : "This gallery is waiting for beautiful wedding photos. Sign in to contribute!"}
            </p>
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Photos
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/auth">Sign In to Upload</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <PhotoGallery
          photos={photos}
          persons={persons}
          folders={folders}
          onDownload={isAuthenticated ? handleDownload : undefined}
          onDelete={isAuthenticated ? handleDelete : undefined}
          onPersonClick={(personId) => {
            toast({
              title: "Person Selected",
              description: "Viewing photos for this person...",
            });
          }}
          onFolderClick={(folderId) => {
            toast({
              title: "Folder Selected",
              description: "Viewing photos in this folder...",
            });
          }}
        />
      )}
    </div>
  );
}
