import { Photo, Folder, FaceDetection } from "@/types";
import { faceDetectionService } from "./faceDetectionService";

// Simple UUID generator for cross-platform compatibility
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class GalleryService {
  private readonly PHOTOS_KEY = "wedding_gallery_photos";
  private readonly FOLDERS_KEY = "wedding_gallery_folders";
  private readonly FACES_KEY = "wedding_gallery_faces";

  async uploadPhotos(
    files: File[],
    userId: string,
    folderId?: string,
  ): Promise<Photo[]> {
    const photos: Photo[] = [];

    for (const file of files) {
      const photo = await this.processFile(file, userId);
      photos.push(photo);

      if (folderId) {
        await this.addPhotoToFolder(photo.id, folderId);
      }
    }

    // Save photos
    const existingPhotos = this.getStoredPhotos();
    const updatedPhotos = [...existingPhotos, ...photos];
    localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(updatedPhotos));

    // Process faces for each photo
    for (const photo of photos) {
      this.processFacesForPhoto(photo);
    }

    return photos;
  }

  private async processFile(file: File, userId: string): Promise<Photo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const result = e.target?.result as string;

        // Create image to get dimensions
        const img = new Image();
        img.onload = () => {
          const photo: Photo = {
            id: generateUUID(),
            filename: file.name,
            url: result,
            thumbnailUrl: result, // In a real app, you'd generate thumbnails
            uploadedBy: userId,
            uploadedAt: new Date(),
            tags: [],
            faces: [],
            fileSize: file.size,
            dimensions: {
              width: img.width,
              height: img.height,
            },
          };

          resolve(photo);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = result;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  private async processFacesForPhoto(photo: Photo): Promise<void> {
    try {
      const img = new Image();
      img.onload = async () => {
        const faces = await faceDetectionService.detectFaces(img, photo.id);
        await faceDetectionService.classifyFaces(faces);

        // Update photo with faces
        const photos = this.getStoredPhotos();
        const photoIndex = photos.findIndex((p) => p.id === photo.id);
        if (photoIndex !== -1) {
          photos[photoIndex].faces = faces;
          localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(photos));
        }

        // Store faces separately for easier querying
        const existingFaces = this.getStoredFaces();
        const updatedFaces = [...existingFaces, ...faces];
        localStorage.setItem(this.FACES_KEY, JSON.stringify(updatedFaces));
      };

      img.src = photo.url;
    } catch (error) {
      console.error("Face processing failed for photo:", photo.id, error);
    }
  }

  async createFolder(name: string, userId: string): Promise<Folder> {
    const folder: Folder = {
      id: generateUUID(),
      name,
      photos: [],
      createdAt: new Date(),
      createdBy: userId,
    };

    const folders = this.getStoredFolders();
    folders.push(folder);
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));

    return folder;
  }

  async addPhotoToFolder(photoId: string, folderId: string): Promise<void> {
    const folders = this.getStoredFolders();
    const folder = folders.find((f) => f.id === folderId);

    if (folder && !folder.photos.includes(photoId)) {
      folder.photos.push(photoId);
      localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
    }
  }

  getPhotos(limit?: number): Photo[] {
    const photos = this.getStoredPhotos();
    return limit ? photos.slice(0, limit) : photos;
  }

  getPhotosByPerson(personId: string): Photo[] {
    const photos = this.getStoredPhotos();
    return photos.filter((photo) =>
      photo.faces.some((face) => face.personId === personId),
    );
  }

  getPhotosByFolder(folderId: string): Photo[] {
    const folders = this.getStoredFolders();
    const folder = folders.find((f) => f.id === folderId);

    if (!folder) return [];

    const photos = this.getStoredPhotos();
    return photos.filter((photo) => folder.photos.includes(photo.id));
  }

  getFolders(): Folder[] {
    return this.getStoredFolders();
  }

  getPhotoById(id: string): Photo | null {
    const photos = this.getStoredPhotos();
    return photos.find((photo) => photo.id === id) || null;
  }

  async deletePhoto(photoId: string): Promise<void> {
    // Remove from photos
    const photos = this.getStoredPhotos();
    const filteredPhotos = photos.filter((p) => p.id !== photoId);
    localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(filteredPhotos));

    // Remove from faces
    const faces = this.getStoredFaces();
    const filteredFaces = faces.filter((f) => f.photoId !== photoId);
    localStorage.setItem(this.FACES_KEY, JSON.stringify(filteredFaces));

    // Remove from folders
    const folders = this.getStoredFolders();
    folders.forEach((folder) => {
      folder.photos = folder.photos.filter((id) => id !== photoId);
    });
    localStorage.setItem(this.FOLDERS_KEY, JSON.stringify(folders));
  }

  getStorageUsed(): number {
    const photos = this.getStoredPhotos();
    return photos.reduce((total, photo) => total + photo.fileSize, 0);
  }

  getStorageLimit(): number {
    return 50 * 1024 * 1024 * 1024; // 50GB in bytes
  }

  private getStoredPhotos(): Photo[] {
    const stored = localStorage.getItem(this.PHOTOS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredFolders(): Folder[] {
    const stored = localStorage.getItem(this.FOLDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getStoredFaces(): FaceDetection[] {
    const stored = localStorage.getItem(this.FACES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export const galleryService = new GalleryService();
