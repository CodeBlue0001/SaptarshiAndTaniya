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

// Storage management utilities
class StorageManager {
  private static readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024 * 1024; // 50GB virtual limit
  private static readonly BROWSER_STORAGE_LIMIT = 4 * 1024 * 1024; // ~4MB safe limit for localStorage
  private static readonly PHOTO_CACHE_KEY = "wedding_gallery_photo_cache";

  static getStorageQuota(): { used: number; available: number; limit: number } {
    const used = this.getUsedStorage();
    return {
      used,
      available: this.MAX_STORAGE_SIZE - used,
      limit: this.MAX_STORAGE_SIZE,
    };
  }

  static getUsedStorage(): number {
    try {
      // Calculate size of all localStorage data
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      return totalSize * 2; // Rough UTF-16 size estimation
    } catch (error) {
      return 0;
    }
  }

  static canStorePhoto(fileSize: number): boolean {
    const quota = this.getStorageQuota();
    const estimatedStorageSize = fileSize * 1.5; // Base64 overhead + metadata

    // For files larger than 10MB, we'll always use thumbnail fallback to manage storage
    if (fileSize > 10 * 1024 * 1024) {
      return false; // Force thumbnail storage for large files (>10MB)
    }

    return quota.used + estimatedStorageSize < this.BROWSER_STORAGE_LIMIT;
  }

  static compressImage(
    canvas: HTMLCanvasElement,
    quality: number = 0.8,
  ): string {
    return canvas.toDataURL("image/jpeg", quality);
  }

  static createThumbnail(img: HTMLImageElement, maxSize: number = 200): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Calculate new dimensions
    let { width, height } = img;
    if (width > height) {
      if (width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;

    // Draw and compress
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.7);
  }

  static storePhotoData(photoId: string, data: string): boolean {
    try {
      // Try to store in localStorage first
      const cacheData = this.getPhotoCache();
      cacheData[photoId] = data;

      const serialized = JSON.stringify(cacheData);
      if (serialized.length < this.BROWSER_STORAGE_LIMIT) {
        localStorage.setItem(this.PHOTO_CACHE_KEY, serialized);
        return true;
      }

      // If too large, store only metadata and show error
      delete cacheData[photoId];
      localStorage.setItem(this.PHOTO_CACHE_KEY, JSON.stringify(cacheData));
      return false;
    } catch (error) {
      console.error("Failed to store photo data:", error);
      return false;
    }
  }

  static getPhotoData(photoId: string): string | null {
    try {
      const cacheData = this.getPhotoCache();
      return cacheData[photoId] || null;
    } catch (error) {
      console.error("Failed to retrieve photo data:", error);
      return null;
    }
  }

  static deletePhotoData(photoId: string): void {
    try {
      const cacheData = this.getPhotoCache();
      delete cacheData[photoId];
      localStorage.setItem(this.PHOTO_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to delete photo data:", error);
    }
  }

  private static getPhotoCache(): Record<string, string> {
    try {
      const cached = localStorage.getItem(this.PHOTO_CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      return {};
    }
  }

  static clearExpiredData(): void {
    // In a real app, this would clear old cached photos
    // For now, we'll implement a simple LRU-like cleanup
    try {
      const cacheData = this.getPhotoCache();
      const entries = Object.entries(cacheData);

      if (entries.length > 50) {
        // Keep only 50 most recent photos in cache
        const toKeep = entries.slice(-30); // Keep last 30
        const newCache = Object.fromEntries(toKeep);
        localStorage.setItem(this.PHOTO_CACHE_KEY, JSON.stringify(newCache));
      }
    } catch (error) {
      console.error("Failed to clear expired data:", error);
    }
  }
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
    const failedUploads: { file: File; error: string }[] = [];

    // Check storage quota before starting
    const quota = StorageManager.getStorageQuota();
    const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

    if (quota.used + totalFileSize * 1.5 > 4 * 1024 * 1024) {
      // 4MB browser limit
      // Clean up old data first
      StorageManager.clearExpiredData();
    }

    for (const file of files) {
      try {
        // Check if we can store this individual file
        if (!StorageManager.canStorePhoto(file.size)) {
          failedUploads.push({
            file,
            error:
              "Storage quota exceeded. Please delete some photos or use smaller images.",
          });
          continue;
        }

        const photo = await this.processFile(file, userId);
        photos.push(photo);

        if (folderId) {
          await this.addPhotoToFolder(photo.id, folderId);
        }
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        failedUploads.push({
          file,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }

    // Save photo metadata (not the actual image data)
    if (photos.length > 0) {
      try {
        const existingPhotos = this.getStoredPhotos();
        const updatedPhotos = [...existingPhotos, ...photos];
        localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(updatedPhotos));
      } catch (error) {
        console.error("Failed to save photo metadata:", error);
        throw new Error("Failed to save photos. Storage may be full.");
      }
    }

    // Process faces for each successfully uploaded photo
    for (const photo of photos) {
      this.processFacesForPhoto(photo);
    }

    // Report any failures
    if (failedUploads.length > 0) {
      const errorMessage = failedUploads
        .map((f) => `${f.file.name}: ${f.error}`)
        .join("\n");
      throw new Error(`Some uploads failed:\n${errorMessage}`);
    }

    return photos;
  }

  private async processFile(file: File, userId: string): Promise<Photo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const result = e.target?.result as string;

        // Create image to get dimensions and generate thumbnail
        const img = new Image();
        img.onload = () => {
          try {
            const photoId = generateUUID();

            // Generate compressed thumbnail
            const thumbnailUrl = StorageManager.createThumbnail(img, 200);

            // Try to store full image data
            const fullImageStored = StorageManager.storePhotoData(
              photoId,
              result,
            );

            const photo: Photo = {
              id: photoId,
              filename: file.name,
              url: fullImageStored ? result : thumbnailUrl, // Fallback to thumbnail if full image can't be stored
              thumbnailUrl: thumbnailUrl,
              uploadedBy: userId,
              uploadedAt: new Date(),
              tags: fullImageStored ? [] : ["storage-limited"], // Tag to indicate storage limitation
              faces: [],
              fileSize: file.size,
              dimensions: {
                width: img.width,
                height: img.height,
              },
            };

            if (!fullImageStored) {
              console.warn(
                `Full image for ${file.name} couldn't be stored due to size limits. Using thumbnail only.`,
              );
            }

            resolve(photo);
          } catch (error) {
            reject(
              new Error(
                `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
              ),
            );
          }
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
    const photo = photos.find((photo) => photo.id === id);

    if (photo) {
      // Try to get full resolution image from storage
      const fullImageData = StorageManager.getPhotoData(id);
      if (fullImageData && photo.url === photo.thumbnailUrl) {
        // Update with full image if available
        photo.url = fullImageData;
      }
    }

    return photo || null;
  }

  async deletePhoto(photoId: string): Promise<void> {
    try {
      // Remove photo data from cache
      StorageManager.deletePhotoData(photoId);

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
    } catch (error) {
      console.error("Failed to delete photo:", error);
      throw new Error("Failed to delete photo. Please try again.");
    }
  }

  getStorageUsed(): number {
    const photos = this.getStoredPhotos();
    return photos.reduce((total, photo) => total + photo.fileSize, 0);
  }

  getStorageLimit(): number {
    return StorageManager.getStorageQuota().limit;
  }

  getStorageInfo() {
    const quota = StorageManager.getStorageQuota();
    return {
      used: this.getStorageUsed(),
      browserUsed: quota.used,
      limit: quota.limit,
      browserLimit: 4 * 1024 * 1024, // 4MB browser limit
      percentage: (this.getStorageUsed() / quota.limit) * 100,
    };
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
