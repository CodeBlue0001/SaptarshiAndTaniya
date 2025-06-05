import React from "react";
import { useToast } from "@/hooks/use-toast";

interface MemoryStats {
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export const HealthMonitor: React.FC = () => {
  const { toast } = useToast();
  const [isMonitoring] = React.useState(true);

  React.useEffect(() => {
    if (!isMonitoring) return;

    let warningShown = false;
    let criticalWarningShown = false;

    const checkHealth = () => {
      try {
        // Check memory usage if available
        const performance = window.performance as any;
        if (performance?.memory) {
          const memory: MemoryStats = performance.memory;
          const usedMB = (memory.usedJSHeapSize || 0) / (1024 * 1024);
          const limitMB = (memory.jsHeapSizeLimit || 0) / (1024 * 1024);

          // Warning at 80% memory usage
          if (usedMB > limitMB * 0.8 && !warningShown) {
            warningShown = true;
            console.warn(
              `High memory usage: ${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`,
            );

            toast({
              title: "Memory Warning",
              description: `High memory usage detected (${usedMB.toFixed(1)}MB). Consider refreshing the page.`,
              variant: "destructive",
            });
          }

          // Critical warning at 95% memory usage
          if (usedMB > limitMB * 0.95 && !criticalWarningShown) {
            criticalWarningShown = true;
            console.error(
              `Critical memory usage: ${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`,
            );

            // Try to clean up localStorage
            try {
              const keys = Object.keys(localStorage);
              keys.forEach((key) => {
                if (
                  key.includes("photo_cache") ||
                  key.includes("backgrounds")
                ) {
                  const data = localStorage.getItem(key);
                  if (data && data.length > 1024 * 1024) {
                    // 1MB+
                    localStorage.removeItem(key);
                    console.log(`Cleaned up large localStorage key: ${key}`);
                  }
                }
              });
            } catch (cleanupError) {
              console.error("Cleanup failed:", cleanupError);
            }

            toast({
              title: "Critical Memory Warning",
              description:
                "Memory usage is critically high. The page may become unresponsive. Please refresh.",
              variant: "destructive",
            });
          }
        }

        // Check localStorage usage
        const localStorageSize = new Blob(Object.values(localStorage)).size;
        if (localStorageSize > 4 * 1024 * 1024) {
          // 4MB
          console.warn(
            `Large localStorage size: ${(localStorageSize / 1024 / 1024).toFixed(1)}MB`,
          );
        }

        // Reset warnings if memory usage drops
        if (performance?.memory) {
          const memory: MemoryStats = performance.memory;
          const usedMB = (memory.usedJSHeapSize || 0) / (1024 * 1024);
          const limitMB = (memory.jsHeapSizeLimit || 0) / (1024 * 1024);

          if (usedMB < limitMB * 0.6) {
            warningShown = false;
            criticalWarningShown = false;
          }
        }
      } catch (error) {
        console.error("Health check failed:", error);
      }
    };

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    // Initial check after 5 seconds
    const initialTimeout = setTimeout(checkHealth, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isMonitoring, toast]);

  // This component doesn't render anything visible
  return null;
};
