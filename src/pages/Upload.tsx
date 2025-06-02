import React from "react";
import { Navigate, Link } from "react-router-dom";
import { FileUpload } from "@/components/ui/file-upload";
import { StorageMonitor } from "@/components/gallery/StorageMonitor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Upload as UploadIcon,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Users,
  Folder,
  HardDrive,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { galleryService } from "@/services/galleryService";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [selectedFolder, setSelectedFolder] = React.useState("");
  const [newFolderName, setNewFolderName] = React.useState("");
  const [folders, setFolders] = React.useState([]);
  const [uploadStats, setUploadStats] = React.useState({
    total: 0,
    completed: 0,
    failed: 0,
  });
  const [storageInfo, setStorageInfo] = React.useState({
    used: 0,
    limit: 0,
    percentage: 0,
    browserUsed: 0,
    browserLimit: 0,
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load folders
    const loadedFolders = galleryService.getFolders();
    setFolders(loadedFolders);

    // Get detailed storage info
    const detailedStorageInfo = galleryService.getStorageInfo();
    setStorageInfo({
      used: detailedStorageInfo.used,
      limit: detailedStorageInfo.limit,
      percentage: detailedStorageInfo.percentage,
      browserUsed: detailedStorageInfo.browserUsed,
      browserLimit: detailedStorageInfo.browserLimit,
    });
  };

  const formatStorageSize = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await galleryService.createFolder(newFolderName.trim(), user.id);
      setNewFolderName("");
      loadData();
      toast({
        title: "Folder created",
        description: `"${newFolderName}" has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilesSelected = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStats({
      total: files.length,
      completed: 0,
      failed: 0,
    });

    try {
      // Check storage space
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const availableSpace = storageInfo.limit - storageInfo.used;

      if (totalSize > availableSpace) {
        throw new Error("Not enough storage space available");
      }

      let completed = 0;
      let failed = 0;

      for (let i = 0; i < files.length; i++) {
        try {
          await galleryService.uploadPhotos(
            [files[i]],
            user.id,
            selectedFolder || undefined,
          );
          completed++;

          // Update progress
          const progress = ((i + 1) / files.length) * 100;
          setUploadProgress(progress);
          setUploadStats({
            total: files.length,
            completed,
            failed,
          });

          // Small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to upload ${files[i].name}:`, error);
          failed++;
          setUploadStats({
            total: files.length,
            completed,
            failed,
          });
        }
      }

      // Show completion message
      if (failed === 0) {
        toast({
          title: "Upload complete!",
          description: `Successfully uploaded ${completed} photo${completed !== 1 ? "s" : ""}.`,
        });
      } else {
        toast({
          title: "Upload completed with errors",
          description: `${completed} photos uploaded successfully, ${failed} failed.`,
          variant: "destructive",
        });
      }

      // Reload data to reflect changes
      loadData();
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStats({
        total: 0,
        completed: 0,
        failed: 0,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/gallery">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Upload Photos</h1>
        <p className="text-muted-foreground">
          Add your wedding photos to the gallery. They will be automatically
          processed for face detection.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Storage Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatStorageSize(storageInfo.used)}</span>
                  <span>Total: {formatStorageSize(storageInfo.limit)}</span>
                </div>
                <Progress value={storageInfo.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {formatStorageSize(storageInfo.limit - storageInfo.used)}{" "}
                  remaining
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Folder Selection */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Organize Photos</CardTitle>
              </div>
              <CardDescription>
                Choose a folder or create a new one to organize your photos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Folders */}
              {folders.length > 0 && (
                <div>
                  <Label htmlFor="folder-select">Select existing folder</Label>
                  <select
                    id="folder-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md bg-background"
                  >
                    <option value="">No folder (add to main gallery)</option>
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name} ({folder.photos.length} photos)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Separator />

              {/* Create New Folder */}
              <div>
                <Label htmlFor="new-folder">Create new folder</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="new-folder"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateFolder()
                    }
                  />
                  <Button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
                Upload Photos
              </CardTitle>
              <CardDescription>
                Select multiple photos to upload. Supported formats: JPEG, PNG,
                GIF, WebP (max 18MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                disabled={isUploading}
                maxFiles={50}
                maxSize={18 * 1024 * 1024} // 18MB per file
              />

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">Uploading photos...</span>
                  </div>

                  <Progress value={uploadProgress} className="mb-3" />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {uploadStats.completed} of {uploadStats.total} completed
                    </span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>

                  {uploadStats.failed > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {uploadStats.failed} failed
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Storage Monitor */}
          <StorageMonitor onClearCache={loadData} />

          {/* Upload Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>High Quality:</strong> Upload original resolution
                  photos up to 18MB for best results
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Face Detection:</strong> Photos with clear faces will
                  be automatically categorized
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Organization:</strong> Use folders to group photos by
                  event or date
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Privacy:</strong> Only registered users can view and
                  download photos
                </div>
              </div>

              <div className="flex items-start gap-2">
                <HardDrive className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <strong>Large Files:</strong> Photos over 10MB are stored as
                  high-quality thumbnails to optimize browser storage
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gallery Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Photos
                  </span>
                  <Badge variant="outline">
                    {galleryService.getPhotos().length}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Folders</span>
                  <Badge variant="outline">{folders.length}</Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Storage Used
                  </span>
                  <Badge variant="outline">
                    {storageInfo.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
