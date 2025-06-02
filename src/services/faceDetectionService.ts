import * as faceapi from "face-api.js";
import { FaceDetection, Person, Photo } from "@/types";

// Simple UUID generator for cross-platform compatibility
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class FaceDetectionService {
  private isInitialized = false;
  private readonly PERSONS_KEY = "wedding_gallery_persons";

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load face detection models
      const modelUrl = "/models"; // You'll need to serve these models

      // For now, we'll simulate the model loading
      await Promise.all([
        // faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        // faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
        // faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
        new Promise((resolve) => setTimeout(resolve, 1000)), // Simulate loading
      ]);

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize face detection:", error);
      throw error;
    }
  }

  async detectFaces(
    imageElement: HTMLImageElement,
    photoId: string,
  ): Promise<FaceDetection[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // In a real implementation, you would use:
      // const detections = await faceapi
      //   .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      //   .withFaceLandmarks()
      //   .withFaceDescriptors();

      // For now, simulate face detection
      const mockDetections: FaceDetection[] = [];

      // Generate 1-3 mock faces for demonstration
      const numFaces = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numFaces; i++) {
        const detection: FaceDetection = {
          id: generateUUID(),
          photoId,
          boundingBox: {
            x: Math.random() * (imageElement.width - 100),
            y: Math.random() * (imageElement.height - 100),
            width: 80 + Math.random() * 40,
            height: 80 + Math.random() * 40,
          },
          descriptor: new Float32Array(128).map(() => Math.random()), // Mock descriptor
          confidence: 0.8 + Math.random() * 0.2,
        };

        mockDetections.push(detection);
      }

      return mockDetections;
    } catch (error) {
      console.error("Face detection failed:", error);
      return [];
    }
  }

  async classifyFaces(faces: FaceDetection[]): Promise<void> {
    const persons = this.getStoredPersons();
    const threshold = 0.6; // Similarity threshold

    for (const face of faces) {
      let bestMatch: Person | null = null;
      let bestDistance = Infinity;

      // Compare with existing persons
      for (const person of persons) {
        const distance = this.calculateDistance(face.descriptor, person.id);
        if (distance < bestDistance && distance < threshold) {
          bestDistance = distance;
          bestMatch = person;
        }
      }

      if (bestMatch) {
        // Assign to existing person
        face.personId = bestMatch.id;
        if (!bestMatch.photos.includes(face.photoId)) {
          bestMatch.photos.push(face.photoId);
        }
      } else {
        // Create new person
        const newPerson: Person = {
          id: generateUUID(),
          name: `Person ${persons.length + 1}`,
          photos: [face.photoId],
          createdAt: new Date(),
        };

        persons.push(newPerson);
        face.personId = newPerson.id;
      }
    }

    this.savePersons(persons);
  }

  async createPerson(name: string, faceIds: string[]): Promise<Person> {
    const persons = this.getStoredPersons();

    const newPerson: Person = {
      id: generateUUID(),
      name,
      photos: [],
      createdAt: new Date(),
    };

    // Update face detections to reference this person
    // This would typically be done through a database update

    persons.push(newPerson);
    this.savePersons(persons);

    return newPerson;
  }

  getPersons(): Person[] {
    return this.getStoredPersons();
  }

  async updatePersonName(personId: string, name: string): Promise<void> {
    const persons = this.getStoredPersons();
    const person = persons.find((p) => p.id === personId);

    if (person) {
      person.name = name;
      this.savePersons(persons);
    }
  }

  private calculateDistance(
    descriptor1: Float32Array,
    personId: string,
  ): number {
    // In a real implementation, you would compare face descriptors
    // For now, return a random distance for simulation
    return Math.random();
  }

  private getStoredPersons(): Person[] {
    const stored = localStorage.getItem(this.PERSONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private savePersons(persons: Person[]): void {
    localStorage.setItem(this.PERSONS_KEY, JSON.stringify(persons));
  }
}

export const faceDetectionService = new FaceDetectionService();
