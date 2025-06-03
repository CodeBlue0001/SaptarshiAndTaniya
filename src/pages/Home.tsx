import React from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Heart,
  Users,
  Upload,
  Eye,
  Download,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { galleryService } from "@/services/galleryService";
import { SlidingBackgrounds } from "@/components/gallery/SlidingBackgrounds";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = React.useState({
    totalPhotos: 0,
    storageUsed: 0,
    storageLimit: 0,
  });

  React.useEffect(() => {
    const photos = galleryService.getPhotos();
    const storageUsed = galleryService.getStorageUsed();
    const storageLimit = galleryService.getStorageLimit();

    setStats({
      totalPhotos: photos.length,
      storageUsed,
      storageLimit,
    });
  }, []);

  const formatStorageSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const features = [
    {
      icon: Camera,
      title: "Smart Photo Organization",
      description:
        "Automatically organize your wedding photos with intelligent categorization and tagging.",
    },
    {
      icon: Users,
      title: "Face Recognition",
      description:
        "AI-powered face detection automatically groups photos by people for easy browsing.",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description:
        "Private galleries with secure login ensure only invited guests can view and download photos.",
    },
    {
      icon: Download,
      title: "Easy Downloads",
      description:
        "Registered users can easily download high-quality versions of their favorite photos.",
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Sliding Background */}
      <SlidingBackgrounds
        autoPlay={true}
        interval={6000}
        showControls={isAuthenticated}
        className="fixed inset-0 z-0"
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center items-center gap-2 mb-6">
                <Heart className="w-12 h-12 text-white drop-shadow-lg fill-current" />
                <Badge
                  variant="secondary"
                  className="text-sm bg-white/20 text-white border-white/30"
                >
                  AI-Powered Wedding Gallery
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Saptarshi & Taniya
                <span className="block text-3xl md:text-4xl mt-2 text-white/90">
                  Our Beautiful Journey
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
                A beautiful, secure platform to store, organize, and share our
                wedding photos. With AI-powered face recognition and smart
                categorization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/30 shadow-lg"
                    >
                      <Link to="/upload">
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Photos
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/30 shadow-lg"
                    >
                      <Link to="/gallery">
                        <Eye className="w-5 h-5 mr-2" />
                        View Gallery
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/30 shadow-lg"
                    >
                      <Link to="/auth">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/30 shadow-lg"
                    >
                      <Link to="/gallery">
                        <Eye className="w-5 h-5 mr-2" />
                        Preview Gallery
                      </Link>
                    </Button>
                  </>
                )}
              </div>
              {/* Quick Stats */}
              {isAuthenticated && stats.totalPhotos > 0 && (
                <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-rose-600">
                        {stats.totalPhotos}
                      </div>
                      <div className="text-sm text-gray-600">
                        Photos Uploaded
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-rose-600">
                        {formatStorageSize(stats.storageUsed)}
                      </div>
                      <div className="text-sm text-gray-600">Storage Used</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-rose-600">
                        {formatStorageSize(
                          stats.storageLimit - stats.storageUsed,
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Storage Available
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Your Wedding Gallery
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional-grade tools and features designed specifically for
                wedding photography and guest sharing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="text-center border-none shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Preview Section */}
        <section className="py-20 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Beautiful Gallery Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                View photos in a stunning, responsive gallery with powerful
                search and organization features.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-24 h-24 text-rose-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">
                        Gallery Preview
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {isAuthenticated
                          ? "Your photos will appear here beautifully organized"
                          : "Sign in to see your personalized gallery"}
                      </p>
                      <Button asChild variant="outline">
                        <Link to="/gallery">
                          <Eye className="w-4 h-4 mr-2" />
                          {isAuthenticated
                            ? "View Your Gallery"
                            : "Preview Gallery"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-rose-500/90 to-pink-600/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Create Your Wedding Gallery?
              </h2>
              <p className="text-xl text-rose-100 mb-8">
                Join thousands of couples who trust us with their most precious
                memories.
              </p>

              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/auth">Start Your Gallery</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-rose-600"
                  >
                    <Link to="/gallery">View Sample Gallery</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
