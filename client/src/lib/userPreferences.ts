// Helper functions to manage user preferences
import { apiRequest } from "./queryClient";

export interface UserPreferences {
  favoriteSchool: string | null;
}

// Get the user's favorite school
export async function getFavoriteSchool(): Promise<string | null> {
  try {
    const res = await apiRequest("GET", "/api/preferences/favorite-school");
    const data = await res.json();
    return data.favoriteSchool;
  } catch (error) {
    console.error("Error fetching favorite school:", error);
    return null;
  }
}

// Set the user's favorite school
export async function setFavoriteSchool(schoolId: string | null): Promise<void> {
  try {
    await apiRequest("POST", "/api/preferences/favorite-school", {
      favoriteSchool: schoolId,
    });
  } catch (error) {
    console.error("Error setting favorite school:", error);
    throw error;
  }
}
