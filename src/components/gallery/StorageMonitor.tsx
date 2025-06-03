import React from "react";
import { HardDrive, AlertTriangle, Info, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { galleryService } from "@/services/galleryService";

interface StorageMonitorProps {
  onClearCache?: () => void;
  className?: string;
}

export const StorageMonitor: React.FC<StorageMonitorProps> = ({
  onClearCache,
  className,
}) => {
  const [storageInfo, setStorageInfo] = React.useState({
    used: 0,
    browserUsed: 0,
    limit: 0,
    browserLimit: 0,
    percentage: 0,
  });

  React.useEffect(() => {
    const updateStorageInfo = () => {
      const info = galleryService.getStorageInfo();
      setStorageInfo(info);
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const browserPercentage =
    (storageInfo.browserUsed / storageInfo.browserLimit) * 100;
  const virtualPercentage = storageInfo.percentage;

  const getStorageStatus = () => {
    if (browserPercentage > 90) {
      return { status: "critical", color: "destructive", icon: AlertTriangle };
    } else if (browserPercentage > 70) {
      return { status: "warning", color: "yellow", icon: AlertTriangle };
    } else {
      return { status: "good", color: "green", icon: CheckCircle };
    }
  };

  const { status, color, icon: StatusIcon } = getStorageStatus();

  const handleClearCache = () => {
    try {
      // Clear photo cache but keep metadata
      localStorage.removeItem("wedding_gallery_photo_cache");

      // Update storage info
      const info = galleryService.getStorageInfo();
      setStorageInfo(info);

      onClearCache?.();
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg">Storage Monitor</CardTitle>
          <Badge
            variant={
              color === "destructive"
                ? "destructive"
                : color === "yellow"
                  ? "secondary"
                  : "default"
            }
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {status === "critical"
              ? "Critical"
              : status === "warning"
                ? "Warning"
                : "Good"}
          </Badge>
        </div>
        <CardDescription>
          Browser storage usage and virtual gallery capacity
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Browser Storage (Critical) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Browser Storage</span>
            <span className="text-sm text-muted-foreground">
              {formatBytes(storageInfo.browserUsed)} /{" "}
              {formatBytes(storageInfo.browserLimit)}
            </span>
          </div>
          <Progress
            value={browserPercentage}
            className={`h-2 ${browserPercentage > 90 ? "bg-red-100" : browserPercentage > 70 ? "bg-yellow-100" : "bg-green-100"}`}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {(100 - browserPercentage).toFixed(1)}% available (
            {formatBytes(storageInfo.browserLimit - storageInfo.browserUsed)}{" "}
            free)
          </p>
        </div>

        {/* Virtual Gallery Storage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Virtual Gallery</span>
            <span className="text-sm text-muted-foreground">
              {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.limit)}
            </span>
          </div>
          <Progress value={virtualPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {(100 - virtualPercentage).toFixed(1)}% available (
            {formatBytes(storageInfo.limit - storageInfo.used)} free)
          </p>
        </div>

        {/* Status Alerts */}
        {browserPercentage > 70 && (
          <Alert variant={browserPercentage > 90 ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {browserPercentage > 90 ? (
                <>
                  <strong>Critical:</strong> Browser storage is nearly full. New
                  photos may fail to upload or be stored as thumbnails only.
                </>
              ) : (
                <>
                  <strong>Warning:</strong> Browser storage is getting full.
                  Consider clearing cache or using smaller images.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Storage Tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Info className="w-4 h-4" />
            Storage Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Browser storage has a ~4MB limit for photo data</li>
            <li>
              • Large photos are stored as compressed thumbnails when space is
              low
            </li>
            <li>• Virtual gallery tracks total photo sizes (70GB limit)</li>
            <li>• Clearing cache removes photo data but keeps metadata</li>
          </ul>
        </div>

        {/* Actions */}
        {browserPercentage > 50 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="flex-1"
            >
              Clear Photo Cache
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
