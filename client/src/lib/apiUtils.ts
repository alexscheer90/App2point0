import { apiRequest as originalApiRequest } from "./queryClient";

/**
 * Wrapper around apiRequest that returns JSON data and includes error handling
 * 
 * @param url API endpoint URL
 * @param method HTTP method (defaults to GET)
 * @param data Optional request body
 * @returns Promise with the parsed API response
 */
export async function apiRequest(
  url: string,
  method: string = "GET",
  data?: unknown
): Promise<any> {
  try {
    const response = await originalApiRequest(method, url, data);
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
}