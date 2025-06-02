export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Photo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
  faces: FaceDetection[];
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface FaceDetection {
  id: string;
  photoId: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  descriptor: Float32Array;
  personId?: string;
  confidence: number;
}

export interface Person {
  id: string;
  name: string;
  photos: string[]; // photo IDs
  avatar?: string; // representative photo URL
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  photos: string[];
  createdAt: Date;
  createdBy: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GalleryState {
  photos: Photo[];
  persons: Person[];
  folders: Folder[];
  isLoading: boolean;
  currentView: "grid" | "people" | "folders";
  selectedPerson?: string;
  selectedFolder?: string;
}
