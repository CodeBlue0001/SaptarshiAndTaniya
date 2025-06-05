import React from "react";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BackgroundImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: Date;
}

interface SlidingBackgroundsProps {
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
}

export const SlidingBackgrounds: React.FC<SlidingBackgroundsProps> = ({
  className,
  autoPlay = true,
  interval = 5000,
  showControls = false,
}) => {
  const { toast } = useToast();
  const [backgrounds, setBackgrounds] = React.useState<BackgroundImage[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isManageOpen, setIsManageOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load backgrounds from localStorage with error handling
  React.useEffect(() => {
    const loadBackgrounds = () => {
      try {
        const stored = localStorage.getItem("wedding_gallery_backgrounds");
        if (stored) {
          const parsedBackgrounds = JSON.parse(stored);
          // Validate the data structure
          if (Array.isArray(parsedBackgrounds)) {
            setBackgrounds(parsedBackgrounds);
            return;
          }
        }

        // Add some default beautiful wedding backgrounds
        const defaultBackgrounds = [
            {
              id: "default-1",
              url:
                "data:image/svg+xml;base64," +
                btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#fdf2f8;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#fce7f3;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#f3e8ff;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad1)"/>
                  <circle cx="400" cy="200" r="100" fill="#fbbf24" opacity="0.1"/>
                  <circle cx="1500" cy="300" r="150" fill="#f59e0b" opacity="0.1"/>
                  <circle cx="300" cy="700" r="80" fill="#d946ef" opacity="0.1"/>
                  <circle cx="1600" cy="800" r="120" fill="#8b5cf6" opacity="0.1"/>
                </svg>
              `),
              name: "Romantic Gradient",
              uploadedAt: new Date(),
            },
            {
              id: "default-2",
              url:
                "data:image/svg+xml;base64," +
                btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#ecfdf5;stop-opacity:1" />
                      <stop offset="50%" style="stop-color:#f0fdf4;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#fefce8;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad2)"/>
                  <polygon points="100,100 300,150 250,350 50,300" fill="#22c55e" opacity="0.1"/>
                  <polygon points="1600,200 1800,250 1750,450 1550,400" fill="#16a34a" opacity="0.1"/>
                  <polygon points="200,600 400,650 350,850 150,800" fill="#84cc16" opacity="0.1"/>
                </svg>
              `),
              name: "Garden Dreams",
              uploadedAt: new Date(),
            },
            {
              id: "default-3",
              url:
                "data:image/svg+xml;base64=" +
                btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
                  <defs>
                    <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
                      <stop offset="70%" style="stop-color:#fed7aa;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#fecaca;stop-opacity:1" />
                    </radialGradient>
                  </defs>
                  <rect width="1920" height="1080" fill="url(#grad3)"/>
                  <path d="M960,100 Q1200,300 960,500 Q720,300 960,100" fill="#f59e0b" opacity="0.2"/>
                  <path d="M960,580 Q1200,780 960,980 Q720,780 960,580" fill="#dc2626" opacity="0.1"/>
                </svg>
              `),
              name: "Sunset Bliss",
              uploadedAt: new Date(),
            },
          ];
          setBackgrounds(defaultBackgrounds);
          localStorage.setItem(
            "wedding_gallery_backgrounds",
            JSON.stringify(defaultBackgrounds),
          );
        }
      } catch (error) {
        console.error("Failed to load backgrounds:", error);
      }
    };

    loadBackgrounds();
  }, []);

  // Auto-slide functionality
  React.useEffect(() => {
    if (!autoPlay || backgrounds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, backgrounds.length]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select only image files.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;

          // Validate the result
          if (!result || typeof result !== 'string') {
            throw new Error('Invalid file data');
          }

          const newBackground: BackgroundImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: result,
            name: file.name,
            uploadedAt: new Date(),
          };

          setBackgrounds((prev) => {
            try {
              const updated = [...prev, newBackground];

              // Check localStorage space before saving
              const testData = JSON.stringify(updated);
              if (testData.length > 4 * 1024 * 1024) { // 4MB limit
                throw new Error('Storage limit exceeded');
              }

              localStorage.setItem(
                "wedding_gallery_backgrounds",
                testData,
              );
              return updated;
            } catch (storageError) {
              console.error('Failed to save backgrounds:', storageError);
              toast({
                title: "Storage warning",
                description: "Background saved temporarily. Clear some data to make it permanent.",
                variant: "destructive",
              });
              return [...prev, newBackground]; // Still add to state, just don't persist
            }
          });

          toast({
            title: "Background added",
            description: `${file.name} has been added to the slideshow.`,
          });
        } catch (error) {
          console.error('Failed to process background image:', error);
          toast({
            title: "Upload failed",
            description: `Failed to process ${file.name}. Please try a smaller image.`,
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}.`,
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
    });

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteBackground = (id: string) => {
    setBackgrounds((prev) => {
      const updated = prev.filter((bg) => bg.id !== id);
      localStorage.setItem(
        "wedding_gallery_backgrounds",
        JSON.stringify(updated),
      );

      // Adjust current index if necessary
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(updated.length - 1);
      } else if (updated.length === 0) {
        setCurrentIndex(0);
      }

      return updated;
    });

    toast({
      title: "Background removed",
      description: "Background image has been removed from the slideshow.",
    });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (backgrounds.length === 0) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50",
          className,
        )}
      >
        {showControls && (
          <div className="absolute top-4 right-4 z-20">
            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/80 hover:bg-white/90"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Backgrounds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Background Images</DialogTitle>
                  <DialogDescription>
                    Upload beautiful background images for your wedding gallery
                    slideshow.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Upload Background Images
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Choose beautiful wedding photos to use as sliding
                      backgrounds
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Select Images"}
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsManageOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }

  const currentBackground = backgrounds[currentIndex];

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Background Images */}
      {backgrounds.map((background, index) => (
        <div
          key={background.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105",
          )}
          style={{
            backgroundImage: `url(${background.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* Slide Indicators */}
      {backgrounds.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/70",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <>
          {/* Management Button */}
          <div className="absolute top-4 right-4 z-20">
            <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/80 hover:bg-white/90"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Manage Backgrounds
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Manage Background Images</DialogTitle>
                  <DialogDescription>
                    Upload and manage beautiful background images for your
                    wedding gallery slideshow.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-2">
                      Add New Background Images
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose beautiful wedding photos to use as sliding
                      backgrounds
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Select Images"}
                    </Button>
                  </div>

                  {/* Current Backgrounds */}
                  <div>
                    <h4 className="font-medium mb-3">
                      Current Backgrounds ({backgrounds.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {backgrounds.map((background, index) => (
                        <div key={background.id} className="relative group">
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={background.url}
                              alt={background.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteBackground(background.id)
                              }
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                          {index === currentIndex && (
                            <Badge className="absolute top-2 left-2 bg-white text-black">
                              Current
                            </Badge>
                          )}
                          <div className="mt-2">
                            <p className="text-xs font-medium truncate">
                              {background.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(background.uploadedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsManageOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Current Image Info */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
              <p className="text-white text-sm font-medium">
                {currentBackground.name}
              </p>
              <p className="text-white/70 text-xs">
                {currentIndex + 1} of {backgrounds.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};