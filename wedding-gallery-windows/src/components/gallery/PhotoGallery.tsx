import React from "react";
import { Grid, Users, Folder, Search, Filter, LayoutGrid } from "lucide-react";
import { Photo, Person, Folder as FolderType } from "@/types";
import { PhotoCard } from "./PhotoCard";
import { PhotoModal } from "./PhotoModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  photos: Photo[];
  persons: Person[];
  folders: FolderType[];
  onDownload?: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
  onPersonClick?: (personId: string) => void;
  onFolderClick?: (folderId: string) => void;
  className?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  persons,
  folders,
  onDownload,
  onDelete,
  onPersonClick,
  onFolderClick,
  className,
}) => {
  const { isAuthenticated } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "people" | "folders">(
    "grid",
  );

  const filteredPhotos = React.useMemo(() => {
    if (!searchTerm) return photos;

    return photos.filter(
      (photo) =>
        photo.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [photos, searchTerm]);

  const handlePhotoView = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handlePrevious = () => {
    if (!selectedPhoto) return;

    const currentIndex = filteredPhotos.findIndex(
      (p) => p.id === selectedPhoto.id,
    );
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!selectedPhoto) return;

    const currentIndex = filteredPhotos.findIndex(
      (p) => p.id === selectedPhoto.id,
    );
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  const getPersonPhotos = (personId: string): Photo[] => {
    return photos.filter((photo) =>
      photo.faces.some((face) => face.personId === personId),
    );
  };

  const getFolderPhotos = (folderId: string): Photo[] => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return [];

    return photos.filter((photo) => folder.photos.includes(photo.id));
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Wedding Gallery</h2>
            <p className="text-muted-foreground">
              {photos.length} photos • {persons.length} people detected
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs
        value={viewMode}
        onValueChange={(value) => setViewMode(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            All Photos
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="folders" className="flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Folders
          </TabsTrigger>
        </TabsList>

        {/* All Photos View */}
        <TabsContent value="grid" className="mt-6">
          {filteredPhotos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Grid className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No photos found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Upload some photos to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onView={handlePhotoView}
                  onDownload={isAuthenticated ? onDownload : undefined}
                  onDelete={isAuthenticated ? onDelete : undefined}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* People View */}
        <TabsContent value="people" className="mt-6">
          {persons.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No people detected</h3>
                <p className="text-muted-foreground text-center">
                  Upload photos with people to see them categorized here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {persons.map((person) => {
                const personPhotos = getPersonPhotos(person.id);
                return (
                  <Card key={person.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback>
                            {person.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {person.name}
                          </CardTitle>
                          <CardDescription>
                            {personPhotos.length} photo
                            {personPhotos.length !== 1 ? "s" : ""}
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPersonClick?.(person.id)}
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {personPhotos.slice(0, 8).map((photo) => (
                          <div
                            key={photo.id}
                            className="aspect-square rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handlePhotoView(photo)}
                          >
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {personPhotos.length > 8 && (
                          <div className="aspect-square rounded bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                            +{personPhotos.length - 8}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Folders View */}
        <TabsContent value="folders" className="mt-6">
          {folders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No folders created</h3>
                <p className="text-muted-foreground text-center">
                  Create folders to organize your photos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {folders.map((folder) => {
                const folderPhotos = getFolderPhotos(folder.id);
                return (
                  <Card key={folder.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                          <Folder className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {folder.name}
                          </CardTitle>
                          <CardDescription>
                            {folderPhotos.length} photo
                            {folderPhotos.length !== 1 ? "s" : ""} • Created{" "}
                            {new Date(folder.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFolderClick?.(folder.id)}
                        >
                          Open Folder
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {folderPhotos.slice(0, 8).map((photo) => (
                          <div
                            key={photo.id}
                            className="aspect-square rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handlePhotoView(photo)}
                          >
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.filename}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {folderPhotos.length > 8 && (
                          <div className="aspect-square rounded bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                            +{folderPhotos.length - 8}
                          </div>
                        )}
                        {folderPhotos.length === 0 && (
                          <div className="aspect-square rounded bg-muted flex items-center justify-center text-xs text-muted-foreground col-span-4">
                            Empty folder
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto}
        photos={filteredPhotos}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDownload={isAuthenticated ? onDownload : undefined}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};
