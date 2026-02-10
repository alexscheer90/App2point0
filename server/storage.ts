import {
  users,
  type User,
  type InsertUser,
  userPreferences,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";

// Storage interface for user preferences
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userPreferences: Map<number, UserPreferences>;
  currentId: number;
  currentPreferenceId: number;

  constructor() {
    this.users = new Map();
    this.userPreferences = new Map();
    this.currentId = 1;
    this.currentPreferenceId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find((pref) => pref.userId === userId);
  }

  async updateUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    let existingPrefs = await this.getUserPreferences(prefs.userId);

    if (existingPrefs) {
      existingPrefs = {
        ...existingPrefs,
        ...prefs,
        // never allow undefined to end up in UserPreferences.favoriteSchool
        favoriteSchool: prefs.favoriteSchool ?? existingPrefs.favoriteSchool ?? null,
      };

      this.userPreferences.set(existingPrefs.id, existingPrefs);
      return existingPrefs;
    } else {
      const id = this.currentPreferenceId++;
      const newPrefs: UserPreferences = {
        ...prefs,
        id,
        // default undefined -> null
        favoriteSchool: prefs.favoriteSchool ?? null,
      };

      this.userPreferences.set(id, newPrefs);
      return newPrefs;
    }
  } // ✅ closes updateUserPreferences
} // ✅ closes MemStorage class

export const storage = new MemStorage();
