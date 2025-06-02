import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";

class AuthService {
  private readonly TOKEN_KEY = "wedding_gallery_token";
  private readonly USERS_KEY = "wedding_gallery_users";

  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = this.getStoredUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error("User not found");
    }

    // In a real app, you'd hash and compare passwords
    const storedPassword = localStorage.getItem(`password_${user.id}`);
    if (storedPassword !== password) {
      throw new Error("Invalid password");
    }

    const token = this.generateToken(user);
    localStorage.setItem(this.TOKEN_KEY, token);

    return user;
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const users = this.getStoredUsers();

    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      role: users.length === 0 ? "admin" : "user", // First user is admin
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(`password_${newUser.id}`, password);

    const token = this.generateToken(newUser);
    localStorage.setItem(this.TOKEN_KEY, token);

    return newUser;
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const users = this.getStoredUsers();
      const user = users.find((u) => u.id === payload.userId);

      if (!user || payload.exp < Date.now()) {
        this.logout();
        return null;
      }

      return user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }),
    );
    const signature = btoa("mock_signature");

    return `${header}.${payload}.${signature}`;
  }
}

export const authService = new AuthService();
