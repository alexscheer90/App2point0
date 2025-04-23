/**
 * Image Optimizer Utility
 * 
 * This utility provides functions for optimized image loading and management.
 * It helps with:
 * - Lazy loading images
 * - Preloading critical images
 * - Fallback handling
 * - Dynamic image path resolution
 */

// Cache for preloaded images
const preloadCache = new Set<string>();

// In-memory cache for image paths
const imagePathCache = new Map<string, string>();

/**
 * Preload critical images
 * @param imagePaths Array of image paths to preload
 */
export function preloadImages(imagePaths: string[]): Promise<void[]> {
  const promises = imagePaths.map(path => {
    if (preloadCache.has(path)) {
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        preloadCache.add(path);
        resolve();
      };
      img.onerror = () => {
        // Still resolve but don't add to cache
        resolve();
      };
      img.src = path;
    });
  });
  
  return Promise.all(promises);
}

/**
 * Check if an image exists
 * @param imagePath Path to check
 * @returns Promise resolving to true if image exists
 */
export async function checkImageExists(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get optimized image path
 * Tries to find the most efficient path for an image
 * 
 * @param schoolName School name to find logo for
 * @param isMacSchool Whether this is a MAC school
 * @returns Path to the image
 */
export function getOptimizedImagePath(schoolName: string, isMacSchool: boolean = false): string {
  const cacheKey = `${schoolName}:${isMacSchool}`;
  
  // Check cache first
  if (imagePathCache.has(cacheKey)) {
    return imagePathCache.get(cacheKey)!;
  }
  
  // Normalize the school name
  const normalizedName = schoolName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  let imagePath: string;
  
  // First check if we have an optimized version
  if (isMacSchool) {
    imagePath = `/optimized/school-logos/mac/${normalizedName}.png`;
  } else {
    imagePath = `/optimized/school-logos/non-mac/${normalizedName}.png`;
  }
  
  // Fallback paths
  const fallbackPaths = [
    // Original location in public folder
    isMacSchool ? 
      `/public/school-logos/mac/${normalizedName}.png` : 
      `/public/school-logos/non-mac/${normalizedName}.png`,
    // Direct import from attached assets
    isMacSchool ?
      `/attached_assets/${schoolName}.png` :
      `/attached_assets/${schoolName}.png`,
    // Generic fallback
    '/public/school-logos/generic-logo.png'
  ];
  
  // Cache the path for future use
  imagePathCache.set(cacheKey, imagePath);
  
  return imagePath;
}

/**
 * Get a properly scaled image
 * 
 * @param imagePath Path to the image
 * @param size Desired size ('small', 'medium', 'large')
 * @returns A properly sized image path
 */
export function getScaledImage(imagePath: string, size: 'small' | 'medium' | 'large'): string {
  // This could be expanded to return properly sized images when available
  // For now it's just a placeholder for future optimization
  return imagePath;
}

/**
 * Handles image load errors by providing fallbacks
 * 
 * @param event Image error event
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;
  const src = img.src;
  
  // Don't fall back more than once
  if (src.includes('generic-logo.png')) return;
  
  // Try fixed filename for Northern Kentucky (specific case)
  if (src.includes('northernkentucky') || src.toLowerCase().includes('northern kentucky')) {
    img.src = '/public/school-logos/non-mac/northernkentucky.png';
    return;
  }
  
  // Try general fallback
  img.src = '/public/school-logos/generic-logo.png';
}