import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const sourceDirs = ['public/school-logos', 'attached_assets'];
const outputDir = 'public/optimized';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a record of optimized images
const optimizationStats = {
  totalImages: 0,
  optimizedImages: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  details: []
};

// Function to process an image
async function optimizeImage(filePath) {
  try {
    const fileName = path.basename(filePath);
    const subDir = path.dirname(filePath).replace(/^(public\/|attached_assets\/)/, '');
    const outputSubDir = path.join(outputDir, subDir);
    const outputPath = path.join(outputSubDir, fileName);
    
    // Create output subdirectory if it doesn't exist
    if (!fs.existsSync(outputSubDir)) {
      fs.mkdirSync(outputSubDir, { recursive: true });
    }

    // Get original file stats
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    // Skip if not an image
    const ext = path.extname(filePath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
      return;
    }

    // Skip SVG files (they're already optimized)
    if (ext === '.svg') {
      // Just copy the SVG file
      fs.copyFileSync(filePath, outputPath);
      return;
    }

    optimizationStats.totalImages++;
    optimizationStats.totalOriginalSize += originalSize;

    // Process the image with Sharp
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Apply optimizations
    let optimizedImage;
    if (ext === '.png') {
      optimizedImage = await image
        .png({ quality: 80, compressionLevel: 9, palette: true })
        .toBuffer();
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      optimizedImage = await image
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
    } else if (ext === '.webp') {
      optimizedImage = await image
        .webp({ quality: 80 })
        .toBuffer();
    } else {
      // For other formats, just resize if needed
      optimizedImage = await image.toBuffer();
    }

    // Write the optimized image
    fs.writeFileSync(outputPath, optimizedImage);
    
    // Get optimized file stats
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    
    optimizationStats.optimizedImages++;
    optimizationStats.totalOptimizedSize += optimizedSize;
    
    // Calculate savings
    const savedBytes = originalSize - optimizedSize;
    const savedPercentage = (savedBytes / originalSize) * 100;
    
    optimizationStats.details.push({
      file: filePath,
      originalSize,
      optimizedSize,
      savedBytes,
      savedPercentage: savedPercentage.toFixed(2) + '%'
    });
    
    console.log(`Optimized: ${filePath} - Original: ${originalSize} bytes, Optimized: ${optimizedSize} bytes, Saved: ${savedPercentage.toFixed(2)}%`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to process a directory
async function processDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        await processDirectory(filePath);
      } else {
        await optimizeImage(filePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  // Process each source directory
  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) {
      await processDirectory(dir);
    } else {
      console.warn(`Directory ${dir} not found, skipping.`);
    }
  }
  
  // Calculate overall savings
  const totalSavedBytes = optimizationStats.totalOriginalSize - optimizationStats.totalOptimizedSize;
  const totalSavedPercentage = (totalSavedBytes / optimizationStats.totalOriginalSize) * 100;
  
  console.log('\nOptimization completed!');
  console.log(`Total images processed: ${optimizationStats.totalImages}`);
  console.log(`Images optimized: ${optimizationStats.optimizedImages}`);
  console.log(`Total original size: ${(optimizationStats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total optimized size: ${(optimizationStats.totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB (${totalSavedPercentage.toFixed(2)}%)`);
  
  // Write optimization stats to file
  fs.writeFileSync('optimization-report.json', JSON.stringify(optimizationStats, null, 2));
  console.log('Optimization report saved to optimization-report.json');
}

main().catch(console.error);