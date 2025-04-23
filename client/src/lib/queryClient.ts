import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Cache constants
const CACHE_TIME = 1000 * 60 * 30; // 30 minutes
const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const SHORT_CACHE_TIME = 1000 * 60 * 10; // 10 minutes
const SHORT_STALE_TIME = 1000 * 60 * 2; // 2 minutes

// For checking if online
const isOnline = (): boolean => typeof navigator !== 'undefined' && navigator.onLine;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    // Add cache control for GET requests
    cache: method.toLowerCase() === 'get' ? 'default' : 'no-store',
  });

  await throwIfResNotOk(res);
  return res;
}

// Enhanced query function with caching improvements
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    // Get cache key from query key
    const url = queryKey[0] as string;
    
    // Check for cached response in sessionStorage for certain endpoints
    const shouldCacheLocally = url.includes('/api/scores') || 
                              url.includes('/api/games') || 
                              url.includes('/api/schools');
                              
    if (shouldCacheLocally) {
      const cacheKey = `cache:${url}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        // Return cached data if it's fresh enough
        if (age < SHORT_STALE_TIME) {
          console.log(`Using cached data for ${url}, age: ${Math.round(age/1000)}s`);
          return data;
        }
      }
    }
    
    // Fetch fresh data
    try {
      const res = await fetch(url, {
        credentials: "include",
        signal,
        // Helps the browser know this resource can be cached
        cache: 'default'
      });
  
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }
  
      await throwIfResNotOk(res);
      const data = await res.json();
      
      // Cache the response in sessionStorage if appropriate
      if (shouldCacheLocally && isOnline()) {
        const cacheKey = `cache:${url}`;
        const cacheEntry = {
          data,
          timestamp: Date.now()
        };
        
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
        } catch (e) {
          // Handle storage quota exceeded or other issues
          console.warn('Failed to cache data in sessionStorage:', e);
        }
      }
      
      return data;
    } catch (error) {
      // Fallback to cached data if available and we're offline or had a network error
      if (shouldCacheLocally && (!isOnline() || error instanceof TypeError)) {
        const cacheKey = `cache:${url}`;
        const cached = sessionStorage.getItem(cacheKey);
        
        if (cached) {
          console.log(`Network error, using cached data for ${url}`);
          const { data } = JSON.parse(cached);
          return data;
        }
      }
      
      throw error;
    }
  };

// Configure data types that need frequent refreshing
const isFrequentRefreshEndpoint = (queryKey: string | readonly unknown[]) => {
  const url = queryKey[0];
  if (typeof url !== 'string') return false;
  
  return url.includes('/api/live') || 
         url.includes('/api/scores/current') || 
         url.includes('/api/games/current');
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false, // Default to no auto-refresh
      refetchOnWindowFocus: false, // Default to no refetch on window focus
      staleTime: STALE_TIME, // Default stale time
      gcTime: CACHE_TIME, // Default cache time
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, but allow retries (up to 2) for network issues
        if (error instanceof Error && error.message.match(/^4\d\d:/)) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
