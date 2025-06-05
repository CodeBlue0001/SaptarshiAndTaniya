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

      // Also clear other potential storage hogs
      this.clearOtherStorageData();
    } catch (error) {
      console.error("Failed to clear expired data:", error);
      // If cleanup fails, try emergency cleanup
      try {
        localStorage.removeItem(this.PHOTO_CACHE_KEY);
        console.log("Emergency cleanup: cleared photo cache");
      } catch (emergencyError) {
        console.error("Emergency cleanup failed:", emergencyError);
      }
    }
  }

  private static clearOtherStorageData(): void {
    try {
      // Clear old face detection data if it gets too large
      const facesData = localStorage.getItem("wedding_gallery_faces");
      if (facesData && facesData.length > 1024 * 1024) {
        // 1MB
        console.log("Clearing large face detection cache");
        localStorage.removeItem("wedding_gallery_faces");
      }

      // Clear old background data if needed
      const backgroundData = localStorage.getItem(
        "wedding_gallery_backgrounds",
      );
      if (backgroundData && backgroundData.length > 2 * 1024 * 1024) {
        // 2MB
        console.log("Clearing large background cache");
        localStorage.removeItem("wedding_gallery_backgrounds");
      }
    } catch (error) {
      console.error("Failed to clear other storage data:", error);
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
    const warnings: string[] = [];
    const failedUploads: { file: File; error: string }[] = [];

    // Aggressive cleanup before starting if storage is getting full
    const initialQuota = StorageManager.getStorageQuota();
    if (initialQuota.used > 3 * 1024 * 1024) {
      // If over 3MB, cleanup
      StorageManager.clearExpiredData();

      // Try more aggressive cleanup if still full
      if (StorageManager.getStorageQuota().used > 3.5 * 1024 * 1024) {
        this.clearOldPhotoCache();
      }
    }

    for (const file of files) {
      try {
        // Never completely reject uploads - always try to process
        const photo = await this.processFile(file, userId);
        photos.push(photo);

        // Track if photo was stored as thumbnail due to size/storage constraints
        if (photo.tags.includes("storage-limited")) {
          warnings.push(
            `${file.name} stored as high-quality thumbnail due to storage optimization`,
          );
        }

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
        // Even if metadata fails, don't lose the photos - try to recover
        try {
          // Clear some space and try again
          this.clearOldPhotoCache();
          localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(updatedPhotos));
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          throw new Error(
            "Failed to save photos. Please clear browser cache and try again.",
          );
        }
      }
    }

    // Process faces for each successfully uploaded photo
    for (const photo of photos) {
      this.processFacesForPhoto(photo);
    }

    // Report warnings and failures with better messaging
    const messages: string[] = [];

    if (warnings.length > 0) {
      messages.push(`Storage optimizations applied:\n${warnings.join("\n")}`);
    }

    if (failedUploads.length > 0) {
      const failures = failedUploads
        .map((f) => `${f.file.name}: ${f.error}`)
        .join("\n");
      messages.push(`Upload failures:\n${failures}`);
    }

    if (messages.length > 0) {
      // Don't throw error for warnings, just log them
      console.warn("Upload completed with messages:", messages.join("\n\n"));

      // Only throw if ALL uploads failed
      if (failedUploads.length === files.length && photos.length === 0) {
        throw new Error(messages.join("\n\n"));
      }
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

            // Always generate thumbnail first (ensures we have something to show)
            const thumbnailUrl = StorageManager.createThumbnail(img, 200);

            // Clean up image reference to free memory
            img.onload = null;
            img.onerror = null;

            // Determine storage strategy based on file size and available space
            let fullImageStored = false;
            let storageStrategy = "thumbnail"; // default to thumbnail

            // For smaller files, try to store full image
            if (file.size <= 10 * 1024 * 1024) {
              // 10MB or less
              fullImageStored = StorageManager.storePhotoData(photoId, result);
              storageStrategy = fullImageStored ? "full" : "thumbnail";
            } else {
              // For large files (10MB+), always use thumbnail to preserve browser storage
              console.log(
                `Large file ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) - using thumbnail storage`,
              );
              storageStrategy = "thumbnail-large";
            }

            const photo: Photo = {
              id: photoId,
              filename: file.name,
              url: fullImageStored ? result : thumbnailUrl,
              thumbnailUrl: thumbnailUrl,
              uploadedBy: userId,
              uploadedAt: new Date(),
              tags: this.getStorageTags(storageStrategy, file.size),
              faces: [],
              fileSize: file.size,
              dimensions: {
                width: img.width,
                height: img.height,
              },
            };

            // Log storage decision for debugging
            console.log(
              `Photo ${file.name}: ${storageStrategy} storage (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
            );

            resolve(photo);
          } catch (error) {
            reject(
              new Error(
                `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
              ),
            );
          }
        };

        img.onerror = () => {
          // Clean up on error
          img.onload = null;
          img.onerror = null;
          reject(new Error("Failed to load image"));
        };
        img.src = result;
      };

      reader.onerror = () => {
        // Clean up reader on error
        reader.onload = null;
        reader.onerror = null;
        reject(new Error("Failed to read file"));
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        reader.onload = null;
        reader.onerror = null;
        reject(new Error("Failed to start file reading"));
      }
    });
  }

  private getStorageTags(strategy: string, fileSize: number): string[] {
    const tags: string[] = [];

    switch (strategy) {
      case "full":
        // No tags needed for full storage
        break;
      case "thumbnail":
        tags.push("storage-limited");
        break;
      case "thumbnail-large":
        tags.push("storage-limited", "large-file");
        break;
    }

    // Add size category tags
    if (fileSize > 15 * 1024 * 1024) {
      tags.push("xl-size");
    } else if (fileSize > 10 * 1024 * 1024) {
      tags.push("large-size");
    } else if (fileSize > 5 * 1024 * 1024) {
      tags.push("medium-size");
    }

    return tags;
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

  private clearOldPhotoCache(): void {
    try {
      console.log("Performing aggressive cache cleanup...");

      // Clear photo cache completely
      localStorage.removeItem("wedding_gallery_photo_cache");

      // Keep only the most recent 20 photos metadata
      const photos = this.getStoredPhotos();
      if (photos.length > 20) {
        const recentPhotos = photos
          .sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime(),
          )
          .slice(0, 20);

        localStorage.setItem(this.PHOTOS_KEY, JSON.stringify(recentPhotos));
        console.log(
          `Reduced photo metadata from ${photos.length} to ${recentPhotos.length} entries`,
        );
      }

      // Clear face detection cache for removed photos
      const faces = this.getStoredFaces();
      const remainingPhotos = this.getStoredPhotos();
      const remainingPhotoIds = new Set(remainingPhotos.map((p) => p.id));

      const filteredFaces = faces.filter((face) =>
        remainingPhotoIds.has(face.photoId),
      );
      if (filteredFaces.length !== faces.length) {
        localStorage.setItem(this.FACES_KEY, JSON.stringify(filteredFaces));
        console.log(
          `Cleaned up ${faces.length - filteredFaces.length} orphaned face detections`,
        );
      }

      console.log("Aggressive cleanup completed");
    } catch (error) {
      console.error("Failed to perform aggressive cleanup:", error);
    }
  }
}

export const galleryService = new GalleryService();
